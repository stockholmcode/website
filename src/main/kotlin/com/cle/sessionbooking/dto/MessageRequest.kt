package com.cle.sessionbooking.dto

import com.cle.sessionbooking.model.MessageType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.util.*

data class MessageRequest(
    @field:NotNull(message = "Session ID is required")
    val sessionId: UUID,
    
    @field:NotNull(message = "Receiver ID is required")
    val receiverId: UUID,
    
    @field:NotBlank(message = "Message content cannot be empty")
    @field:Size(max = 1000, message = "Message content cannot exceed 1000 characters")
    val content: String,
    
    @field:NotNull(message = "Message type is required")
    val messageType: MessageType = MessageType.TEXT
)