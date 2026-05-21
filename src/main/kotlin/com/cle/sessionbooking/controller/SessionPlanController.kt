package com.cle.sessionbooking.controller

import com.cle.sessionbooking.dto.SessionPlanRequest
import com.cle.sessionbooking.dto.SessionPlanResponse
import com.cle.sessionbooking.service.SessionPlanService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/session-plans")
@CrossOrigin(origins = ["http://localhost:3000"])
class SessionPlanController(
    private val sessionPlanService: SessionPlanService
) {

    @PostMapping
    fun createOrUpdateSessionPlan(
        @RequestHeader("User-Id") userId: String,
        @Valid @RequestBody request: SessionPlanRequest
    ): ResponseEntity<SessionPlanResponse> {
        val sessionPlan = sessionPlanService.createOrUpdateSessionPlan(UUID.fromString(userId), request)
        return ResponseEntity.ok(sessionPlan)
    }

    @GetMapping("/session/{sessionId}")
    fun getSessionPlan(
        @RequestHeader("User-Id") userId: String,
        @PathVariable sessionId: UUID
    ): ResponseEntity<SessionPlanResponse?> {
        val sessionPlan = sessionPlanService.getSessionPlan(sessionId, UUID.fromString(userId))
        return if (sessionPlan != null) {
            ResponseEntity.ok(sessionPlan)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PutMapping("/session/{sessionId}/complete")
    fun markSessionPlanCompleted(
        @RequestHeader("User-Id") userId: String,
        @PathVariable sessionId: UUID
    ): ResponseEntity<SessionPlanResponse> {
        val sessionPlan = sessionPlanService.markSessionPlanCompleted(sessionId, UUID.fromString(userId))
        return ResponseEntity.ok(sessionPlan)
    }

    @DeleteMapping("/session/{sessionId}")
    fun deleteSessionPlan(
        @RequestHeader("User-Id") userId: String,
        @PathVariable sessionId: UUID
    ): ResponseEntity<Void> {
        sessionPlanService.deleteSessionPlan(sessionId, UUID.fromString(userId))
        return ResponseEntity.noContent().build()
    }
}