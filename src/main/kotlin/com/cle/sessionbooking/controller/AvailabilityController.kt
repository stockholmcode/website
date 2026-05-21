package com.cle.sessionbooking.controller

import com.cle.sessionbooking.model.TeacherAvailability
import com.cle.sessionbooking.service.AvailabilityService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/v1/availability")
@CrossOrigin(origins = ["http://localhost:3000"])
class AvailabilityController(
    private val availabilityService: AvailabilityService
) {
    
    @GetMapping("/teacher/{teacherId}")
    fun getTeacherAvailability(@PathVariable teacherId: UUID): ResponseEntity<List<TeacherAvailability>> {
        val availability = availabilityService.getTeacherAvailability(teacherId)
        return ResponseEntity.ok(availability)
    }
    
    @PostMapping
    fun addTeacherAvailability(@RequestBody availability: TeacherAvailability): ResponseEntity<TeacherAvailability> {
        val savedAvailability = availabilityService.addTeacherAvailability(availability)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAvailability)
    }
    
    @PutMapping("/{availabilityId}")
    fun updateTeacherAvailability(
        @PathVariable availabilityId: UUID,
        @RequestBody availability: TeacherAvailability
    ): ResponseEntity<TeacherAvailability> {
        val updatedAvailability = availabilityService.updateTeacherAvailability(availabilityId, availability)
        return ResponseEntity.ok(updatedAvailability)
    }
    
    @DeleteMapping("/{availabilityId}")
    fun removeTeacherAvailability(@PathVariable availabilityId: UUID): ResponseEntity<Void> {
        availabilityService.removeTeacherAvailability(availabilityId)
        return ResponseEntity.noContent().build()
    }
}