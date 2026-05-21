package com.cle.sessionbooking.controller

import com.cle.sessionbooking.dto.MessageRequest
import com.cle.sessionbooking.dto.MessageResponse
import com.cle.sessionbooking.service.MessageService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = ["http://localhost:3000"])
class MessageController(
    private val messageService: MessageService
) {

    @PostMapping
    fun sendMessage(
        @RequestHeader("User-Id") senderId: String,
        @Valid @RequestBody request: MessageRequest
    ): ResponseEntity<MessageResponse> {
        val message = messageService.sendMessage(UUID.fromString(senderId), request)
        return ResponseEntity.ok(message)
    }

    @GetMapping("/session/{sessionId}")
    fun getSessionMessages(
        @RequestHeader("User-Id") userId: String,
        @PathVariable sessionId: UUID
    ): ResponseEntity<List<MessageResponse>> {
        val messages = messageService.getSessionMessages(sessionId, UUID.fromString(userId))
        return ResponseEntity.ok(messages)
    }

    @PutMapping("/{messageId}/read")
    fun markMessageAsRead(
        @RequestHeader("User-Id") userId: String,
        @PathVariable messageId: Long
    ): ResponseEntity<MessageResponse> {
        val message = messageService.markMessageAsRead(messageId, UUID.fromString(userId))
        return ResponseEntity.ok(message)
    }

    @GetMapping("/unread")
    fun getUnreadMessages(
        @RequestHeader("User-Id") userId: String
    ): ResponseEntity<List<MessageResponse>> {
        val messages = messageService.getUnreadMessages(UUID.fromString(userId))
        return ResponseEntity.ok(messages)
    }

    @GetMapping("/unread/count")
    fun getUnreadMessageCount(
        @RequestHeader("User-Id") userId: String
    ): ResponseEntity<Map<String, Long>> {
        val count = messageService.getUnreadMessageCount(UUID.fromString(userId))
        return ResponseEntity.ok(mapOf("unreadCount" to count))
    }

    @GetMapping("/conversations")
    fun getUserConversations(
        @RequestHeader("User-Id") userId: String
    ): ResponseEntity<Map<UUID, MessageResponse>> {
        val conversations = messageService.getUserConversations(UUID.fromString(userId))
        return ResponseEntity.ok(conversations)
    }
}