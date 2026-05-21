package com.cle.sessionbooking.dto

import java.time.LocalDateTime
import java.util.*

data class SessionPlanResponse(
    val id: Long,
    val sessionId: UUID,
    val learningObjectives: String?,
    val materialsNeeded: String?,
    val locationDetails: String?,
    val emergencyContact: String?,
    val specialInstructions: String?,
    val isCompleted: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)