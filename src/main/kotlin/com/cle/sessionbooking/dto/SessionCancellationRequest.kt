package com.cle.sessionbooking.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class SessionCancellationRequest(
    @field:NotBlank(message = "Cancellation reason is required")
    @field:Size(max = 500, message = "Cancellation reason must not exceed 500 characters")
    val reason: String
)