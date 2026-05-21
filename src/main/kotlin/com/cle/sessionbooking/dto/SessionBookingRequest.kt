package com.cle.sessionbooking.dto

import com.cle.sessionbooking.model.SessionFormat
import jakarta.validation.constraints.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*

data class SessionBookingRequest(
    @field:NotNull(message = "Teacher ID is required")
    val teacherId: UUID,
    
    @field:NotNull(message = "Learner ID is required")
    val learnerId: UUID,
    
    @field:NotBlank(message = "Skill name is required")
    @field:Size(max = 100, message = "Skill name must not exceed 100 characters")
    val skillName: String,
    
    @field:NotNull(message = "Start time is required")
    @field:Future(message = "Start time must be in the future")
    val startTime: LocalDateTime,
    
    @field:NotNull(message = "End time is required")
    @field:Future(message = "End time must be in the future")
    val endTime: LocalDateTime,
    
    @field:NotNull(message = "Session format is required")
    val format: SessionFormat,
    
    @field:Size(max = 500, message = "Location must not exceed 500 characters")
    val location: String? = null,
    
    @field:Size(max = 500, message = "Virtual meeting URL must not exceed 500 characters")
    val virtualMeetingUrl: String? = null,
    
    @field:NotNull(message = "Price is required")
    @field:DecimalMin(value = "0.00", message = "Price must be positive")
    val price: BigDecimal,
    
    @field:Size(max = 1000, message = "Learner goals must not exceed 1000 characters")
    val learnerGoals: String? = null,
    
    @field:Size(max = 1000, message = "Preparation notes must not exceed 1000 characters")
    val preparationNotes: String? = null
) {
    @AssertTrue(message = "End time must be after start time")
    fun isEndTimeAfterStartTime(): Boolean {
        return endTime.isAfter(startTime)
    }
    
    @AssertTrue(message = "Location is required for in-person sessions")
    fun isLocationValidForInPerson(): Boolean {
        return if (format == SessionFormat.IN_PERSON) {
            !location.isNullOrBlank()
        } else true
    }
    
    @AssertTrue(message = "Virtual meeting URL is required for online sessions")
    fun isVirtualUrlValidForOnline(): Boolean {
        return if (format == SessionFormat.ONLINE) {
            !virtualMeetingUrl.isNullOrBlank()
        } else true
    }
}