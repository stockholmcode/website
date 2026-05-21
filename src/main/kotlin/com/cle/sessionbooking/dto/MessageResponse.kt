package com.cle.sessionbooking.dto

import com.cle.sessionbooking.model.MessageType
import java.time.LocalDateTime
import java.util.*

data class MessageResponse(
    val id: Long,
    val sessionId: UUID,
    val senderId: UUID,
    val receiverId: UUID,
    val content: String,
    val messageType: MessageType,
    val isRead: Boolean,
    val sentAt: LocalDateTime,
    val readAt: LocalDateTime?
)