package com.cle.sessionbooking.dto

import com.cle.sessionbooking.model.SessionFormat
import java.math.BigDecimal

data class TeacherSearchRequest(
    val skill: String? = null,
    val location: String? = null,
    val maxDistance: Double? = null,
    val priceRange: List<Double>? = null, // [min, max]
    val format: String? = null // "ALL", "ONLINE", "IN_PERSON", "HYBRID"
)

data class TeacherSearchResult(
    val id: String,
    val name: String,
    val email: String,
    val skill: String,
    val price: BigDecimal,
    val rating: Double, // Mock for now
    val distance: Double, // Mock for now
    val format: List<SessionFormat>,
    val location: String,
    val experience: String, // Mock for now
    val course: CourseResponse,
    val availabilities: List<AvailabilityResponse>,
    val user: UserResponse
)

data class SearchResultsResponse(
    val results: List<TeacherSearchResult>,
    val totalCount: Int,
    val page: Int = 1,
    val limit: Int = 10
)

data class SkillResponse(
    val id: String,
    val name: String,
    val category: String
)