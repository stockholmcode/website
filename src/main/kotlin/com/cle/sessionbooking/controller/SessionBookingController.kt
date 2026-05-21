package com.cle.sessionbooking.controller

import com.cle.sessionbooking.dto.SessionBookingRequest
import com.cle.sessionbooking.dto.SessionCancellationRequest
import com.cle.sessionbooking.dto.SessionResponse
import com.cle.sessionbooking.service.SessionBookingService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.*

@RestController
@RequestMapping("/api/v1/sessions")
@CrossOrigin(origins = ["http://localhost:3000"]) // For frontend development
class SessionBookingController(
    private val sessionBookingService: SessionBookingService
) {
    
    @PostMapping
    fun bookSession(@Valid @RequestBody request: SessionBookingRequest): ResponseEntity<SessionResponse> {
        val session = sessionBookingService.bookSession(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(session)
    }
    
    @GetMapping("/{sessionId}")
    fun getSession(@PathVariable sessionId: UUID): ResponseEntity<SessionResponse> {
        val session = sessionBookingService.getSession(sessionId)
        return ResponseEntity.ok(session)
    }
    
    @GetMapping("/user/{userId}")
    fun getUserSessions(
        @PathVariable userId: UUID,
        @RequestParam(required = false) fromDate: LocalDateTime?
    ): ResponseEntity<List<SessionResponse>> {
        val sessions = sessionBookingService.getUserSessions(
            userId, 
            fromDate ?: LocalDateTime.now()
        )
        return ResponseEntity.ok(sessions)
    }
    
    @PutMapping("/{sessionId}/confirm")
    fun confirmSession(@PathVariable sessionId: UUID): ResponseEntity<SessionResponse> {
        val session = sessionBookingService.confirmSession(sessionId)
        return ResponseEntity.ok(session)
    }
    
    @PutMapping("/{sessionId}/cancel")
    fun cancelSession(
        @PathVariable sessionId: UUID,
        @Valid @RequestBody cancellationRequest: SessionCancellationRequest
    ): ResponseEntity<SessionResponse> {
        val session = sessionBookingService.cancelSession(sessionId, cancellationRequest)
        return ResponseEntity.ok(session)
    }
    
    @PutMapping("/{sessionId}/reschedule")
    fun rescheduleSession(
        @PathVariable sessionId: UUID,
        @RequestParam newStartTime: LocalDateTime,
        @RequestParam newEndTime: LocalDateTime
    ): ResponseEntity<SessionResponse> {
        val session = sessionBookingService.rescheduleSession(sessionId, newStartTime, newEndTime)
        return ResponseEntity.ok(session)
    }
    
    @PutMapping("/{sessionId}/complete")
    fun markSessionCompleted(
        @PathVariable sessionId: UUID,
        @RequestParam(required = false) sessionNotes: String?
    ): ResponseEntity<SessionResponse> {
        val session = sessionBookingService.markSessionCompleted(sessionId, sessionNotes)
        return ResponseEntity.ok(session)
    }
}