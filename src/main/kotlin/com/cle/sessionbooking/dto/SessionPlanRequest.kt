package com.cle.sessionbooking.dto

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.util.*

data class SessionPlanRequest(
    @field:NotNull(message = "Session ID is required")
    val sessionId: UUID,
    
    @field:Size(max = 500, message = "Learning objectives cannot exceed 500 characters")
    val learningObjectives: String? = null,
    
    @field:Size(max = 1000, message = "Materials needed cannot exceed 1000 characters")
    val materialsNeeded: String? = null,
    
    @field:Size(max = 500, message = "Location details cannot exceed 500 characters")
    val locationDetails: String? = null,
    
    @field:Size(max = 200, message = "Emergency contact cannot exceed 200 characters")
    val emergencyContact: String? = null,
    
    @field:Size(max = 1000, message = "Special instructions cannot exceed 1000 characters")
    val specialInstructions: String? = null
)