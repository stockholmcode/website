package com.cle.sessionbooking.service

import com.cle.sessionbooking.dto.SessionPlanRequest
import com.cle.sessionbooking.dto.SessionPlanResponse
import com.cle.sessionbooking.exception.SessionNotFoundException
import com.cle.sessionbooking.model.SessionPlan
import com.cle.sessionbooking.repository.SessionPlanRepository
import com.cle.sessionbooking.repository.SessionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
@Transactional
class SessionPlanService(
    private val sessionPlanRepository: SessionPlanRepository,
    private val sessionRepository: SessionRepository
) {

    fun createOrUpdateSessionPlan(userId: UUID, request: SessionPlanRequest): SessionPlanResponse {
        // Verify session exists and user is part of it
        val session = sessionRepository.findById(request.sessionId)
            .orElseThrow { SessionNotFoundException("Session not found with ID: ${request.sessionId}") }

        if (session.teacherId != userId && session.learnerId != userId) {
            throw IllegalArgumentException("User $userId is not part of session ${request.sessionId}")
        }

        val sessionPlan = sessionPlanRepository.findBySessionId(request.sessionId)
            .orElse(SessionPlan().apply { sessionId = request.sessionId })

        // Update session plan fields
        sessionPlan.apply {
            learningObjectives = request.learningObjectives
            materialsNeeded = request.materialsNeeded
            locationDetails = request.locationDetails
            emergencyContact = request.emergencyContact
            specialInstructions = request.specialInstructions
        }

        val savedPlan = sessionPlanRepository.save(sessionPlan)
        return mapToResponse(savedPlan)
    }

    fun getSessionPlan(sessionId: UUID, userId: UUID): SessionPlanResponse? {
        // Verify session exists and user is part of it
        val session = sessionRepository.findById(sessionId)
            .orElseThrow { SessionNotFoundException("Session not found with ID: $sessionId") }

        if (session.teacherId != userId && session.learnerId != userId) {
            throw IllegalArgumentException("User $userId is not part of session $sessionId")
        }

        return sessionPlanRepository.findBySessionId(sessionId)
            .map { mapToResponse(it) }
            .orElse(null)
    }

    fun markSessionPlanCompleted(sessionId: UUID, userId: UUID): SessionPlanResponse {
        // Verify session exists and user is part of it
        val session = sessionRepository.findById(sessionId)
            .orElseThrow { SessionNotFoundException("Session not found with ID: $sessionId") }

        if (session.teacherId != userId && session.learnerId != userId) {
            throw IllegalArgumentException("User $userId is not part of session $sessionId")
        }

        val sessionPlan = sessionPlanRepository.findBySessionId(sessionId)
            .orElseThrow { IllegalArgumentException("Session plan not found for session $sessionId") }

        sessionPlan.isCompleted = true
        val updatedPlan = sessionPlanRepository.save(sessionPlan)
        return mapToResponse(updatedPlan)
    }

    fun deleteSessionPlan(sessionId: UUID, userId: UUID) {
        // Verify session exists and user is part of it
        val session = sessionRepository.findById(sessionId)
            .orElseThrow { SessionNotFoundException("Session not found with ID: $sessionId") }

        if (session.teacherId != userId && session.learnerId != userId) {
            throw IllegalArgumentException("User $userId is not part of session $sessionId")
        }

        val sessionPlan = sessionPlanRepository.findBySessionId(sessionId)
            .orElseThrow { IllegalArgumentException("Session plan not found for session $sessionId") }

        sessionPlanRepository.delete(sessionPlan)
    }

    private fun mapToResponse(sessionPlan: SessionPlan): SessionPlanResponse {
        return SessionPlanResponse(
            id = sessionPlan.id,
            sessionId = sessionPlan.sessionId,
            learningObjectives = sessionPlan.learningObjectives,
            materialsNeeded = sessionPlan.materialsNeeded,
            locationDetails = sessionPlan.locationDetails,
            emergencyContact = sessionPlan.emergencyContact,
            specialInstructions = sessionPlan.specialInstructions,
            isCompleted = sessionPlan.isCompleted,
            createdAt = sessionPlan.createdAt,
            updatedAt = sessionPlan.updatedAt
        )
    }
}