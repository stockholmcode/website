package com.cle.sessionbooking.service

import com.cle.sessionbooking.dto.*
import com.cle.sessionbooking.model.*
import com.cle.sessionbooking.repository.CourseRepository
import com.cle.sessionbooking.repository.TeacherAvailabilityRepository
import com.cle.sessionbooking.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.util.*

@Service
@Transactional
class CourseService(
    private val courseRepository: CourseRepository,
    private val availabilityRepository: TeacherAvailabilityRepository,
    private val userRepository: UserRepository
) {

    fun createCourse(teacherId: UUID, request: CourseCreateRequest): CourseResponse {
        val teacher = userRepository.findById(teacherId)
            .orElseThrow { RuntimeException("Teacher not found") }

        if (teacher.userType != UserType.TEACHER) {
            throw RuntimeException("Only teachers can create courses")
        }

        val course = Course(
            teacherId = teacherId,
            title = request.title,
            description = request.description,
            skillName = request.skillName,
            cost = request.cost,
            duration = request.duration,
            format = request.format,
            images = request.images,
            prerequisites = request.prerequisites,
            learningObjectives = request.learningObjectives,
            isActive = true,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )

        val savedCourse = courseRepository.save(course)
        return savedCourse.toCourseResponse(teacher.name)
    }

    fun updateCourse(courseId: UUID, teacherId: UUID, request: CourseUpdateRequest): CourseResponse {
        val course = courseRepository.findById(courseId)
            .orElseThrow { RuntimeException("Course not found") }

        if (course.teacherId != teacherId) {
            throw RuntimeException("You can only update your own courses")
        }

        val teacher = userRepository.findById(teacherId)
            .orElseThrow { RuntimeException("Teacher not found") }

        val updatedCourse = course.copy(
            title = request.title ?: course.title,
            description = request.description ?: course.description,
            skillName = request.skillName ?: course.skillName,
            cost = request.cost ?: course.cost,
            duration = request.duration ?: course.duration,
            format = request.format ?: course.format,
            prerequisites = request.prerequisites ?: course.prerequisites,
            learningObjectives = request.learningObjectives ?: course.learningObjectives,
            images = request.images ?: course.images,
            isActive = request.isActive ?: course.isActive,
            updatedAt = LocalDateTime.now()
        )

        val savedCourse = courseRepository.save(updatedCourse)
        return savedCourse.toCourseResponse(teacher.name)
    }

    fun deleteCourse(courseId: UUID, teacherId: UUID) {
        val course = courseRepository.findById(courseId)
            .orElseThrow { RuntimeException("Course not found") }

        if (course.teacherId != teacherId) {
            throw RuntimeException("You can only delete your own courses")
        }

        courseRepository.delete(course)
    }

    fun getCourseById(courseId: UUID): CourseResponse {
        val course = courseRepository.findById(courseId)
            .orElseThrow { RuntimeException("Course not found") }

        val teacher = userRepository.findById(course.teacherId)
            .orElseThrow { RuntimeException("Teacher not found") }

        return course.toCourseResponse(teacher.name)
    }

    fun getCoursesByTeacher(teacherId: UUID): List<CourseResponse> {
        val teacher = userRepository.findById(teacherId)
            .orElseThrow { RuntimeException("Teacher not found") }

        return courseRepository.findByTeacherId(teacherId)
            .map { it.toCourseResponse(teacher.name) }
    }

    fun getAllCourses(): List<CourseResponse> {
        return courseRepository.findByIsActiveTrue()
            .map { course ->
                val teacher = userRepository.findById(course.teacherId)
                    .orElseThrow { RuntimeException("Teacher not found") }
                course.toCourseResponse(teacher.name)
            }
    }

    fun addAvailability(courseId: UUID, teacherId: UUID, request: AvailabilityCreateRequest): AvailabilityResponse {
        val course = courseRepository.findById(courseId)
            .orElseThrow { RuntimeException("Course not found") }

        if (course.teacherId != teacherId) {
            throw RuntimeException("You can only add availability to your own courses")
        }

        val availability = TeacherAvailability(
            teacherId = teacherId,
            courseId = courseId,
            courseName = course.title,
            date = request.date,
            startTime = request.startTime,
            endTime = request.endTime,
            maxStudents = request.maxStudents,
            location = request.location,
            virtualMeetingUrl = request.virtualMeetingUrl,
            isActive = true,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )

        val savedAvailability = availabilityRepository.save(availability)
        return savedAvailability.toAvailabilityResponse()
    }

    fun addMultipleAvailabilities(courseId: UUID, teacherId: UUID, request: MultipleAvailabilityCreateRequest): List<AvailabilityResponse> {
        val course = courseRepository.findById(courseId)
            .orElseThrow { RuntimeException("Course not found") }

        if (course.teacherId != teacherId) {
            throw RuntimeException("You can only add availability to your own courses")
        }

        val availabilities = request.availabilities.map { availRequest ->
            TeacherAvailability(
                teacherId = teacherId,
                courseId = courseId,
                courseName = course.title,
                date = availRequest.date,
                startTime = availRequest.startTime,
                endTime = availRequest.endTime,
                maxStudents = availRequest.maxStudents,
                location = availRequest.location,
                virtualMeetingUrl = availRequest.virtualMeetingUrl,
                isActive = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        }

        val savedAvailabilities = availabilityRepository.saveAll(availabilities)
        return savedAvailabilities.map { it.toAvailabilityResponse() }
    }

    fun addMultipleAvailabilitiesFromFrontend(courseId: UUID, teacherId: UUID, request: FrontendMultipleAvailabilityCreateRequest): List<AvailabilityResponse> {
        val course = courseRepository.findById(courseId)
            .orElseThrow { RuntimeException("Course not found") }

        if (course.teacherId != teacherId) {
            throw RuntimeException("You can only add availability to your own courses")
        }

        val availabilities = request.timeSlots.map { timeSlot ->
            TeacherAvailability(
                teacherId = teacherId,
                courseId = courseId,
                courseName = course.title,
                date = LocalDate.parse(timeSlot.date),
                startTime = LocalTime.parse(timeSlot.startTime),
                endTime = LocalTime.parse(timeSlot.endTime),
                maxStudents = request.maxStudents,
                location = request.location,
                virtualMeetingUrl = request.virtualMeetingUrl,
                isActive = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        }

        val savedAvailabilities = availabilityRepository.saveAll(availabilities)
        return savedAvailabilities.map { it.toAvailabilityResponse() }
    }

    fun updateAvailability(availabilityId: UUID, teacherId: UUID, request: AvailabilityCreateRequest): AvailabilityResponse {
        val availability = availabilityRepository.findById(availabilityId)
            .orElseThrow { RuntimeException("Availability not found") }

        if (availability.teacherId != teacherId) {
            throw RuntimeException("You can only update your own availability")
        }

        val updatedAvailability = availability.copy(
            date = request.date,
            startTime = request.startTime,
            endTime = request.endTime,
            maxStudents = request.maxStudents,
            location = request.location,
            virtualMeetingUrl = request.virtualMeetingUrl,
            updatedAt = LocalDateTime.now()
        )

        val savedAvailability = availabilityRepository.save(updatedAvailability)
        return savedAvailability.toAvailabilityResponse()
    }

    fun deleteAvailability(availabilityId: UUID, teacherId: UUID) {
        val availability = availabilityRepository.findById(availabilityId)
            .orElseThrow { RuntimeException("Availability not found") }

        if (availability.teacherId != teacherId) {
            throw RuntimeException("You can only delete your own availability")
        }

        availabilityRepository.delete(availability)
    }

    private fun Course.toCourseResponse(teacherName: String): CourseResponse {
        val availabilities = availabilityRepository.findByCourseIdAndIsActiveTrue(this.id!!)
            .map { it.toAvailabilityResponse() }

        return CourseResponse(
            id = this.id!!.toString(),
            teacherId = this.teacherId.toString(),
            teacherName = teacherName,
            title = this.title,
            description = this.description,
            skillName = this.skillName,
            cost = this.cost,
            duration = this.duration,
            format = this.format,
            images = this.images,
            prerequisites = this.prerequisites,
            learningObjectives = this.learningObjectives,
            isActive = this.isActive,
            createdAt = this.createdAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            updatedAt = this.updatedAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            availabilities = availabilities
        )
    }

    private fun TeacherAvailability.toAvailabilityResponse(): AvailabilityResponse {
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