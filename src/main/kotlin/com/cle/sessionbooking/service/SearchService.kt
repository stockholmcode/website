package com.cle.sessionbooking.service

import com.cle.sessionbooking.dto.*
import com.cle.sessionbooking.model.SessionFormat
import com.cle.sessionbooking.model.UserType
import com.cle.sessionbooking.repository.CourseRepository
import com.cle.sessionbooking.repository.TeacherAvailabilityRepository
import com.cle.sessionbooking.repository.UserRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.random.Random

@Service
class SearchService(
    private val courseRepository: CourseRepository,
    private val availabilityRepository: TeacherAvailabilityRepository,
    private val userRepository: UserRepository
) {

    fun searchTeachers(request: TeacherSearchRequest): SearchResultsResponse {
        // Get courses based on skill filter
        val courses = if (request.skill.isNullOrBlank()) {
            courseRepository.findByIsActiveTrue()
        } else {
            courseRepository.findBySkillNameContainingIgnoreCaseAndIsActiveTrue(request.skill)
        }

        // Apply price filter
        val filteredCourses = courses.filter { course ->
            if (request.priceRange != null && request.priceRange.size == 2) {
                val minPrice = request.priceRange[0]
                val maxPrice = request.priceRange[1]
                course.cost.toDouble() >= minPrice && course.cost.toDouble() <= maxPrice
            } else {
                true
            }
        }.filter { course ->
            // Apply format filter
            if (request.format != null && request.format != "ALL") {
                try {
                    val sessionFormat = SessionFormat.valueOf(request.format)
                    course.format == sessionFormat
                } catch (e: IllegalArgumentException) {
                    true
                }
            } else {
                true
            }
        }

        // Group by teacher and create search results
        val teacherResults = mutableMapOf<UUID, TeacherSearchResult>()

        filteredCourses.forEach { course ->
            val teacher = userRepository.findById(course.teacherId).orElse(null)
            if (teacher != null && teacher.userType == UserType.TEACHER) {
                val availabilities = availabilityRepository.findByCourseIdAndIsActiveTrue(course.id!!)
                
                if (availabilities.isNotEmpty()) {
                    val teacherId = course.teacherId
                    
                    if (!teacherResults.containsKey(teacherId)) {
                        teacherResults[teacherId] = createTeacherSearchResult(course, teacher, availabilities)
                    } else {
                        // Update existing result with additional course/availabilities
                        val existing = teacherResults[teacherId]!!
                        val updatedFormats = (existing.format + course.format).distinct()
                        val updatedAvailabilities = existing.availabilities + availabilities.map { it.toAvailabilityResponse() }
                        
                        teacherResults[teacherId] = existing.copy(
                            format = updatedFormats,
                            availabilities = updatedAvailabilities
                        )
                    }
                }
            }
        }

        val results = teacherResults.values.toList()
        
        return SearchResultsResponse(
            results = results,
            totalCount = results.size,
            page = 1,
            limit = results.size
        )
    }

    fun getAvailableSkills(): List<SkillResponse> {
        // Get all unique skills from active courses
        val skills = courseRepository.findByIsActiveTrue()
            .map { it.skillName }
            .distinct()
            .sorted()

        return skills.mapIndexed { index, skillName ->
            SkillResponse(
                id = "skill-$index",
                name = skillName,
                category = getCategoryForSkill(skillName)
            )
        }
    }

    private fun createTeacherSearchResult(
        course: com.cle.sessionbooking.model.Course,
        teacher: com.cle.sessionbooking.model.User,
        availabilities: List<com.cle.sessionbooking.model.TeacherAvailability>
    ): TeacherSearchResult {
        val courseResponse = CourseResponse(
            id = course.id!!.toString(),
            teacherId = course.teacherId.toString(),
            teacherName = teacher.name,
            title = course.title,
            description = course.description,
            skillName = course.skillName,
            cost = course.cost,
            duration = course.duration,
            format = course.format,
            images = course.images,
            prerequisites = course.prerequisites,
            learningObjectives = course.learningObjectives,
            isActive = course.isActive,
            createdAt = course.createdAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            updatedAt = course.updatedAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            availabilities = availabilities.map { it.toAvailabilityResponse() }
        )

        val userResponse = UserResponse(
            id = teacher.id!!.toString(),
            email = teacher.email,
            name = teacher.name,
            userType = teacher.userType,
            authProvider = teacher.authProvider.name,
            profilePicture = teacher.profilePicture,
            isVerified = teacher.isVerified,
            createdAt = teacher.createdAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            updatedAt = teacher.updatedAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        )

        // Mock data for demonstration
        val rating = 4.5 + Random.nextDouble() * 0.5
        val distance = Random.nextDouble() * 20
        val experienceYears = Random.nextInt(1, 11)

        return TeacherSearchResult(
            id = teacher.id!!.toString(),
            name = teacher.name,
            email = teacher.email,
            skill = course.skillName,
            price = course.cost,
            rating = rating,
            distance = distance,
            format = listOf(course.format),
            location = availabilities.firstOrNull()?.location ?: "Online",
            experience = "$experienceYears years",
            course = courseResponse,
            availabilities = availabilities.map { it.toAvailabilityResponse() },
            user = userResponse
        )
    }

    private fun getCategoryForSkill(skillName: String): String {
        return when {
            skillName.lowercase().contains("guitar") ||
            skillName.lowercase().contains("piano") ||
            skillName.lowercase().contains("violin") ||
            skillName.lowercase().contains("drums") ||
            skillName.lowercase().contains("music") -> "Music"
            
            skillName.lowercase().contains("python") ||
            skillName.lowercase().contains("javascript") ||
            skillName.lowercase().contains("programming") ||
            skillName.lowercase().contains("coding") ||
            skillName.lowercase().contains("web") -> "Technology"
            
            skillName.lowercase().contains("spanish") ||
            skillName.lowercase().contains("french") ||
            skillName.lowercase().contains("german") ||
            skillName.lowercase().contains("italian") ||
            skillName.lowercase().contains("language") -> "Language"
            
            skillName.lowercase().contains("yoga") ||
            skillName.lowercase().contains("fitness") ||
            skillName.lowercase().contains("training") ||
            skillName.lowercase().contains("pilates") -> "Fitness"
            
            skillName.lowercase().contains("math") ||
            skillName.lowercase().contains("physics") ||
            skillName.lowercase().contains("chemistry") ||
            skillName.lowercase().contains("science") -> "Academic"
            
            skillName.lowercase().contains("art") ||
            skillName.lowercase().contains("painting") ||
            skillName.lowercase().contains("drawing") -> "Art"
            
            skillName.lowercase().contains("cooking") ||
            skillName.lowercase().contains("baking") ||
            skillName.lowercase().contains("culinary") -> "Culinary"
            
            else -> "Other"
        }
    }

    private fun com.cle.sessionbooking.model.TeacherAvailability.toAvailabilityResponse(): AvailabilityResponse {
        return AvailabilityResponse(
            id = this.id!!.toString(),
            teacherId = this.teacherId.toString(),
            courseId = this.courseId.toString(),
            courseName = this.courseName,
            date = this.date,
            startTime = this.startTime,
            endTime = this.endTime,
            maxStudents = this.maxStudents,
            location = this.location,
            virtualMeetingUrl = this.virtualMeetingUrl,
            isActive = this.isActive,
            createdAt = this.createdAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            updatedAt = this.updatedAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        )
    }
}