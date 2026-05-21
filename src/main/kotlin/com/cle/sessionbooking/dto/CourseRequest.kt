package com.cle.sessionbooking.dto

import com.cle.sessionbooking.model.SessionFormat
import jakarta.validation.constraints.*
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalTime

data class CourseCreateRequest(
    @field:NotBlank(message = "Title is required")
    @field:Size(max = 200, message = "Title must be less than 200 characters")
    val title: String,

    @field:NotBlank(message = "Description is required")
    @field:Size(max = 2000, message = "Description must be less than 2000 characters")
    val description: String,

    @field:NotBlank(message = "Skill name is required")
    @field:Size(max = 100, message = "Skill name must be less than 100 characters")
    val skillName: String,

    @field:NotNull(message = "Cost is required")
    @field:DecimalMin(value = "0.0", message = "Cost must be positive")
    val cost: BigDecimal,

    @field:NotNull(message = "Duration is required")
    @field:Min(value = 15, message = "Duration must be at least 15 minutes")
    val duration: Int,

    @field:NotNull(message = "Format is required")
    val format: SessionFormat,

    @field:Size(max = 500, message = "Prerequisites must be less than 500 characters")
    val prerequisites: String? = null,

    val learningObjectives: List<String> = emptyList(),

    val images: List<String> = emptyList()
)

data class CourseUpdateRequest(
    @field:Size(max = 200, message = "Title must be less than 200 characters")
    val title: String? = null,

    @field:Size(max = 2000, message = "Description must be less than 2000 characters")
    val description: String? = null,

    @field:Size(max = 100, message = "Skill name must be less than 100 characters")
    val skillName: String? = null,

    @field:DecimalMin(value = "0.0", message = "Cost must be positive")
    val cost: BigDecimal? = null,

    @field:Min(value = 15, message = "Duration must be at least 15 minutes")
    val duration: Int? = null,

    val format: SessionFormat? = null,

    @field:Size(max = 500, message = "Prerequisites must be less than 500 characters")
    val prerequisites: String? = null,

    val learningObjectives: List<String>? = null,

    val images: List<String>? = null,

    val isActive: Boolean? = null
)

data class AvailabilityCreateRequest(
    @field:NotNull(message = "Date is required")
    val date: LocalDate,

    @field:NotNull(message = "Start time is required")
    val startTime: LocalTime,

    @field:NotNull(message = "End time is required")
    val endTime: LocalTime,

    @field:NotNull(message = "Max students is required")
    @field:Min(value = 1, message = "Max students must be at least 1")
    val maxStudents: Int,

    @field:Size(max = 200, message = "Location must be less than 200 characters")
    val location: String? = null,

    @field:Size(max = 500, message = "Virtual meeting URL must be less than 500 characters")
    val virtualMeetingUrl: String? = null
)

data class MultipleAvailabilityCreateRequest(
    val availabilities: List<AvailabilityCreateRequest>
)

data class TimeSlot(
    val date: String,
    val startTime: String,
    val endTime: String
)

data class FrontendMultipleAvailabilityCreateRequest(
    val timeSlots: List<TimeSlot>,
    val maxStudents: Int,
    val virtualMeetingUrl: String? = null,
    val location: String? = null
)

data class CourseResponse(
    val id: String,
    val teacherId: String,
    val teacherName: String,
    val title: String,
    val description: String,
    val skillName: String,
    val cost: BigDecimal,
    val duration: Int,
    val format: SessionFormat,
    val images: List<String>,
    val prerequisites: String?,
    val learningObjectives: List<String>,
    val isActive: Boolean,
    val createdAt: String,
    val updatedAt: String,
    val availabilities: List<AvailabilityResponse>
)

data class AvailabilityResponse(
    val id: String,
    val teacherId: String,
    val courseId: String,
    val courseName: String,
    val date: LocalDate,
    val startTime: LocalTime,
    val endTime: LocalTime,
    val maxStudents: Int,
    val location: String?,
    val virtualMeetingUrl: String?,
    val isActive: Boolean,
    val createdAt: String,
    val updatedAt: String
)