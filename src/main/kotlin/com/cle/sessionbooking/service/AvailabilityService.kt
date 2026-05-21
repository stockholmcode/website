package com.cle.sessionbooking.service

import com.cle.sessionbooking.model.TeacherAvailability
import com.cle.sessionbooking.repository.TeacherAvailabilityRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class AvailabilityService(
    private val availabilityRepository: TeacherAvailabilityRepository
) {
    
    fun isTeacherAvailable(teacherId: UUID, startTime: LocalDateTime, endTime: LocalDateTime): Boolean {
        val requestDate = startTime.toLocalDate()
        val availabilities = availabilityRepository.findByTeacherIdAndDateAndIsActiveTrue(teacherId, requestDate)
        
        return availabilities.any { availability ->
            val requestStartTime = startTime.toLocalTime()
            val requestEndTime = endTime.toLocalTime()
            
            requestStartTime >= availability.startTime && 
            requestEndTime <= availability.endTime
        }
    }
    
    fun getTeacherAvailability(teacherId: UUID): List<TeacherAvailability> {
        return availabilityRepository.findByTeacherIdAndIsActiveTrue(teacherId)
    }
    
    fun addTeacherAvailability(availability: TeacherAvailability): TeacherAvailability {
        return availabilityRepository.save(availability)
    }
    
    fun updateTeacherAvailability(availabilityId: UUID, availability: TeacherAvailability): TeacherAvailability {
        val existingAvailability = availabilityRepository.findById(availabilityId)
            .orElseThrow { IllegalArgumentException("Availability not found") }
        
        // Create a new availability with updated values
        val updatedAvailability = existingAvailability.copy(
            teacherId = availability.teacherId,
            courseId = availability.courseId,
            courseName = availability.courseName,
            date = availability.date,
            startTime = availability.startTime,
            endTime = availability.endTime,
            maxStudents = availability.maxStudents,
            location = availability.location,
            virtualMeetingUrl = availability.virtualMeetingUrl,
            isActive = availability.isActive
        )
        
        return availabilityRepository.save(updatedAvailability)
    }
    
    fun removeTeacherAvailability(availabilityId: UUID) {
        val availability = availabilityRepository.findById(availabilityId)
            .orElseThrow { IllegalArgumentException("Availability not found") }
        
        // Deactivate the availability
        val deactivatedAvailability = availability.copy(isActive = false)
        availabilityRepository.save(deactivatedAvailability)
    }
}