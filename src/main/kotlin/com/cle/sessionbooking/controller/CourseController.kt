package com.cle.sessionbooking.controller

import com.cle.sessionbooking.dto.*
import com.cle.sessionbooking.service.CourseService
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/v1/courses")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:3001"])
class CourseController(
    private val courseService: CourseService
) {

    @GetMapping
    fun getAllCourses(
        @RequestParam(required = false) teacherId: String?,
        @RequestParam(required = false) skill: String?,
        @RequestParam(required = false) isActive: Boolean?
    ): ResponseEntity<List<CourseResponse>> {
        val courses = when {
            teacherId != null -> courseService.getCoursesByTeacher(UUID.fromString(teacherId))
            else -> courseService.getAllCourses()
        }
        
        val filteredCourses = courses.filter { course ->
            (skill == null || course.skillName.contains(skill, ignoreCase = true)) &&
            (isActive == null || course.isActive == isActive)
        }
        
        return ResponseEntity.ok(filteredCourses)
    }

    @GetMapping("/{courseId}")
    fun getCourseById(@PathVariable courseId: String): ResponseEntity<Any> {
        return try {
            val course = courseService.getCourseById(UUID.fromString(courseId))
            ResponseEntity.ok(course)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf(
                    "error" to "Course not found",
                    "message" to (e.message ?: "Course not found"),
                    "code" to "COURSE_NOT_FOUND"
                ))
        }
    }

    @PostMapping
    fun createCourse(
        @Valid @RequestBody request: CourseCreateRequest,
        httpRequest: HttpServletRequest
    ): ResponseEntity<Any> {
        val teacherId = httpRequest.getAttribute("userId") as? String
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Authentication required"))

        return try {
            val course = courseService.createCourse(UUID.fromString(teacherId), request)
            ResponseEntity.status(HttpStatus.CREATED).body(course)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf(
                    "error" to "Failed to create course",
                    "message" to (e.message ?: "Failed to create course"),
                    "code" to "COURSE_CREATE_FAILED"
                ))
        }
    }

    @PutMapping("/{courseId}")
    fun updateCourse(
        @PathVariable courseId: String,
        @Valid @RequestBody request: CourseUpdateRequest,
        httpRequest: HttpServletRequest
    ): ResponseEntity<Any> {
        val teacherId = httpRequest.getAttribute("userId") as? String
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Authentication required"))

        return try {
            val course = courseService.updateCourse(UUID.fromString(courseId), UUID.fromString(teacherId), request)
            ResponseEntity.ok(course)
        } catch (e: Exception) {
            val status = when {
                e.message?.contains("not found") == true -> HttpStatus.NOT_FOUND
                e.message?.contains("your own") == true -> HttpStatus.FORBIDDEN
                else -> HttpStatus.BAD_REQUEST
            }
            ResponseEntity.status(status)
                .body(mapOf(
                    "error" to "Failed to update course",
                    "message" to (e.message ?: "Failed to update course"),
                    "code" to "COURSE_UPDATE_FAILED"
                ))
        }
    }

    @DeleteMapping("/{courseId}")
    fun deleteCourse(
        @PathVariable courseId: String,
        httpRequest: HttpServletRequest
    ): ResponseEntity<Any> {
        val teacherId = httpRequest.getAttribute("userId") as? String
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Authentication required"))

        return try {
            courseService.deleteCourse(UUID.fromString(courseId), UUID.fromString(teacherId))
            ResponseEntity.noContent().build()
        } catch (e: Exception) {
            val status = when {
                e.message?.contains("not found") == true -> HttpStatus.NOT_FOUND
                e.message?.contains("your own") == true -> HttpStatus.FORBIDDEN
                else -> HttpStatus.BAD_REQUEST
            }
            ResponseEntity.status(status)
                .body(mapOf(
                    "error" to "Failed to delete course",
                    "message" to (e.message ?: "Failed to delete course"),
                    "code" to "COURSE_DELETE_FAILED"
                ))
        }
    }

    @PostMapping("/{courseId}/availabilities")
    fun addAvailability(
        @PathVariable courseId: String,
        @Valid @RequestBody request: AvailabilityCreateRequest,
        httpRequest: HttpServletRequest
    ): ResponseEntity<Any> {
        val teacherId = httpRequest.getAttribute("userId") as? String
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Authentication required"))

        return try {
            val availability = courseService.addAvailability(UUID.fromString(courseId), UUID.fromString(teacherId), request)
            ResponseEntity.status(HttpStatus.CREATED).body(availability)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf(
                    "error" to "Failed to add availability",
                    "message" to (e.message ?: "Failed to add availability"),
                    "code" to "AVAILABILITY_CREATE_FAILED"
                ))
        }
    }

    @PostMapping("/{courseId}/availabilities/multiple")
    fun addMultipleAvailabilities(
        @PathVariable courseId: String,
        @Valid @RequestBody request: FrontendMultipleAvailabilityCreateRequest,
        httpRequest: HttpServletRequest
    ): ResponseEntity<Any> {
        val teacherId = httpRequest.getAttribute("userId") as? String
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Authentication required"))

        return try {
            val availabilities = courseService.addMultipleAvailabilitiesFromFrontend(UUID.fromString(courseId), UUID.fromString(teacherId), request)
            ResponseEntity.status(HttpStatus.CREATED).body(availabilities)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf(
                    "error" to "Failed to add availabilities",
                    "message" to (e.message ?: "Failed to add availabilities"),
                    "code" to "AVAILABILITIES_CREATE_FAILED"
                ))
        }
    }
}