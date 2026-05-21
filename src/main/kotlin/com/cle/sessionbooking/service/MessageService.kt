package com.cle.sessionbooking.service

import com.cle.sessionbooking.dto.MessageRequest
import com.cle.sessionbooking.dto.MessageResponse
import com.cle.sessionbooking.exception.SessionNotFoundException
import com.cle.sessionbooking.model.Message
import com.cle.sessionbooking.repository.MessageRepository
import com.cle.sessionbooking.repository.SessionRepository
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*

@Service
@Transactional
class MessageService(
    private val messageRepository: MessageRepository,
    private val sessionRepository: SessionRepository,
    private val messagingTemplate: SimpMessagingTemplate
) {

    fun sendMessage(senderId: UUID, request: MessageRequest): MessageResponse {
        // Verify session exists
        val session = sessionRepository.findById(request.sessionId)
            .orElseThrow { SessionNotFoundException("Session not found with ID: ${request.sessionId}") }

        // Verify sender is part of the session
        if (session.teacherId != senderId && session.learnerId != senderId) {
            throw IllegalArgumentException("User $senderId is not part of session ${request.sessionId}")
        }

        // Verify receiver is part of the session
        if (session.teacherId != request.receiverId && session.learnerId != request.receiverId) {
            throw IllegalArgumentException("Receiver ${request.receiverId} is not part of session ${request.sessionId}")
        }

        val message = Message().apply {
            sessionId = request.sessionId
            this.senderId = senderId
            receiverId = request.receiverId
            content = request.content
            messageType = request.messageType
        }

        val savedMessage = messageRepository.save(message)
        val response = mapToResponse(savedMessage)

        // Send real-time message via WebSocket
        messagingTemplate.convertAndSendToUser(
            request.receiverId.toString(),
            "/queue/messages",
            response
        )

        return response
    }

    fun getSessionMessages(sessionId: UUID, userId: UUID): List<MessageResponse> {
        // Verify user is part of the session
        val session = sessionRepository.findById(sessionId)
            .orElseThrow { SessionNotFoundException("Session not found with ID: $sessionId") }

        if (session.teacherId != userId && session.learnerId != userId) {
            throw IllegalArgumentException("User $userId is not part of session $sessionId")
        }

        return messageRepository.findBySessionIdAndUserId(sessionId, userId)
            .map { mapToResponse(it) }
    }

    fun markMessageAsRead(messageId: Long, userId: UUID): MessageResponse {
        val message = messageRepository.findById(messageId)
            .orElseThrow { IllegalArgumentException("Message not found with ID: $messageId") }

        if (message.receiverId != userId) {
            throw IllegalArgumentException("User $userId is not the receiver of message $messageId")
        }

        message.isRead = true
        message.readAt = LocalDateTime.now()

        val updatedMessage = messageRepository.save(message)
        return mapToResponse(updatedMessage)
    }

    fun getUnreadMessages(userId: UUID): List<MessageResponse> {
        return messageRepository.findUnreadMessagesByReceiver(userId)
            .map { mapToResponse(it) }
    }

    fun getUnreadMessageCount(userId: UUID): Long {
        return messageRepository.countUnreadMessagesByReceiver(userId)
    }

    fun getUserConversations(userId: UUID): Map<UUID, MessageResponse> {
        val messages = messageRepository.findConversationsByUser(userId)
        
        // Group by session and get the latest message for each session
        return messages.groupBy { it.sessionId }
            .mapValues { (_, sessionMessages) -> 
                mapToResponse(sessionMessages.maxByOrNull { it.sentAt }!!)
            }
    }

    private fun mapToResponse(message: Message): MessageResponse {
        return MessageResponse(
            id = message.id,
            sessionId = message.sessionId,
            senderId = message.senderId,
            receiverId = message.receiverId,
            content = message.content,
            messageType = message.messageType,
            isRead = message.isRead,
            sentAt = message.sentAt,
            readAt = message.readAt
        )
    }
}