package com.cle.sessionbooking.service

import com.cle.sessionbooking.dto.MessageRequest
import com.cle.sessionbooking.exception.SessionNotFoundException
import com.cle.sessionbooking.model.*
import com.cle.sessionbooking.repository.MessageRepository
import com.cle.sessionbooking.repository.SessionRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.messaging.simp.SimpMessagingTemplate
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class MessageServiceTest {

    private val messageRepository = mock<MessageRepository>()
    private val sessionRepository = mock<SessionRepository>()
    private val messagingTemplate = mock<SimpMessagingTemplate>()
    
    private val messageService = MessageService(
        messageRepository,
        sessionRepository,
        messagingTemplate
    )

    @Test
    fun `sendMessage should create and save message successfully`() {
        // Given
        val senderId = 1L
        val receiverId = 2L
        val sessionId = 1L
        
        val session = Session().apply {
            id = sessionId
            teacherId = senderId
            learnerId = receiverId
            skillName = "Test Skill"
            status = SessionStatus.CONFIRMED
        }
        
        val request = MessageRequest(
            sessionId = sessionId,
            receiverId = receiverId,
            content = "Hello!",
            messageType = MessageType.TEXT
        )
        
        val savedMessage = Message().apply {
            id = 1L
            this.sessionId = sessionId
            this.senderId = senderId
            this.receiverId = receiverId
            content = "Hello!"
            messageType = MessageType.TEXT
        }
        
        whenever(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session))
        whenever(messageRepository.save(any<Message>())).thenReturn(savedMessage)
        
        // When
        val result = messageService.sendMessage(senderId, request)
        
        // Then
        assertNotNull(result)
        assertEquals(savedMessage.id, result.id)
        assertEquals(savedMessage.content, result.content)
        verify(messageRepository).save(any<Message>())
        verify(messagingTemplate).convertAndSendToUser(
            receiverId.toString(),
            "/queue/messages",
            result
        )
    }

    @Test
    fun `sendMessage should throw exception when session not found`() {
        // Given
        val senderId = 1L
        val request = MessageRequest(
            sessionId = 999L,
            receiverId = 2L,
            content = "Hello!",
            messageType = MessageType.TEXT
        )
        
        whenever(sessionRepository.findById(999L)).thenReturn(Optional.empty())
        
        // When & Then
        assertThrows<SessionNotFoundException> {
            messageService.sendMessage(senderId, request)
        }
    }

    @Test
    fun `sendMessage should throw exception when sender not part of session`() {
        // Given
        val senderId = 3L // Not part of session
        val sessionId = 1L
        
        val session = Session().apply {
            id = sessionId
            teacherId = 1L
            learnerId = 2L
            skillName = "Test Skill"
        }
        
        val request = MessageRequest(
            sessionId = sessionId,
            receiverId = 2L,
            content = "Hello!",
            messageType = MessageType.TEXT
        )
        
        whenever(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session))
        
        // When & Then
        assertThrows<IllegalArgumentException> {
            messageService.sendMessage(senderId, request)
        }
    }

    @Test
    fun `getSessionMessages should return messages for user`() {
        // Given
        val userId = 1L
        val sessionId = 1L
        
        val session = Session().apply {
            id = sessionId
            teacherId = userId
            learnerId = 2L
            skillName = "Test Skill"
        }
        
        val messages = listOf(
            Message().apply {
                id = 1L
                this.sessionId = sessionId
                senderId = userId
                receiverId = 2L
                content = "Hello!"
                messageType = MessageType.TEXT
            }
        )
        
        whenever(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session))
        whenever(messageRepository.findBySessionIdAndUserId(sessionId, userId)).thenReturn(messages)
        
        // When
        val result = messageService.getSessionMessages(sessionId, userId)
        
        // Then
        assertEquals(1, result.size)
        assertEquals(messages[0].content, result[0].content)
    }
}