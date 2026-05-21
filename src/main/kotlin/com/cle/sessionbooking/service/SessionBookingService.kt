package com.cle.sessionbooking.service

import com.cle.sessionbooking.dto.SessionBookingRequest
import com.cle.sessionbooking.dto.SessionCancellationRequest
import com.cle.sessionbooking.dto.SessionResponse
import com.cle.sessionbooking.exception.SessionConflictException
import com.cle.sessionbooking.exception.SessionNotFoundException
import com.cle.sessionbooking.exception.InvalidSessionOperationException
import com.cle.sessionbooking.model.Session
import com.cle.sessionbooking.model.SessionStatus
import com.cle.sessionbooking.repository.SessionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*

@Service
@Transactional
class SessionBookingService(
    private val sessionRepository: SessionRepository,
    private val availabilityService: AvailabilityService,
    private val notificationService: NotificationService
) {
    
    fun bookSession(request: SessionBookingRequest): SessionResponse {
        // Validate teacher availability
        if (!availabilityService.isTeacherAvailable(request.teacherId, request.startTime, request.endTime)) {
            throw SessionConflictException("Teacher is not available at the requested time")
        }
        
        // Check for conflicting sessions
        val conflictingSessions = sessionRepository.findConflictingSessions(
            request.teacherId, 
            request.startTime, 
            request.endTime
        )
        
        if (conflictingSessions.isNotEmpty()) {
            throw SessionConflictException("Teacher already has a session booked during this time")
        }
        
        // Create and save session
        val session = Session(
            teacherId = request.teacherId,
            learnerId = request.learnerId,
            skillName = request.skillName,
            startTime = request.startTime,
            endTime = request.endTime,
            format = request.format,
            location = request.location,
            virtualMeetingUrl = request.virtualMeetingUrl,
            price = request.price,
            learnerGoals = request.learnerGoals,
            preparationNotes = request.preparationNotes,
            status = SessionStatus.PENDING
        )
        
        val savedSession = sessionRepository.save(session)
        
        // Send notifications
        notificationService.sendBookingConfirmation(savedSession)
        
        return SessionResponse.from(savedSession)
    }
    
    fun getSession(sessionId: UUID): SessionResponse {
        val session = sessionRepository.findById(sessionId)
            .orElseThrow { SessionNotFoundException("Session not found with id: $sessionId") }
        
        return SessionResponse.from(session)
    }
    
    fun getUserSessions(userId: UUID, fromDate: LocalDateTime = LocalDateTime.now()): List<SessionResponse> {
        return sessionRepository.findUpcomingSessionsForUser(userId, fromDate)
            .map { SessionResponse.from(it) }
    }
    
    fun confirmSession(sessionId: UUID): SessionResponse {
        val session = getSessionEntity(sessionId)
        
        if (session.status != SessionStatus.PENDING) {
            throw InvalidSessionOperationException("Only pending sessions can be confirmed")
        }
        
        // Update session status
        session.status = SessionStatus.CONFIRMED
        session.updatedAt = LocalDateTime.now()
        
        val savedSession = sessionRepository.save(session)
        notificationService.sendSessionConfirmation(savedSession)
        
        return SessionResponse.from(savedSession)
    }
    
    fun cancelSession(sessionId: UUID, cancellationRequest: SessionCancellationRequest): SessionResponse {
        val session = getSessionEntity(sessionId)
        
        if (!session.isCancellable()) {
            throw InvalidSessionOperationException("Session cannot be cancelled in its current state")
        }
        
        // Update session for cancellation
        session.status = SessionStatus.CANCELLED
        session.cancelledAt = LocalDateTime.now()
        session.cancellationReason = cancellationRequest.reason
        session.updatedAt = LocalDateTime.now()
        
        val savedSession = sessionRepository.save(session)
        notificationService.sendCancellationNotification(savedSession)
        
        return SessionResponse.from(savedSession)
    }
    
    fun rescheduleSession(sessionId: UUID, newStartTime: LocalDateTime, newEndTime: LocalDateTime): SessionResponse {
        val session = getSessionEntity(sessionId)
        
        if (!session.isReschedulable()) {
            throw InvalidSessionOperationException("Session cannot be rescheduled in its current state")
        }
        
        // Validate new time slot
        if (!availabilityService.isTeacherAvailable(session.teacherId, newStartTime, newEndTime)) {
            throw SessionConflictException("Teacher is not available at the new requested time")
        }
        
        // Check for conflicts (excluding current session)
        val conflictingSessions = sessionRepository.findConflictingSessions(
            session.teacherId, 
            newStartTime, 
            newEndTime
        ).filter { it.id != sessionId }
        
        if (conflictingSessions.isNotEmpty()) {
            throw SessionConflictException("Teacher already has a session booked during the new time")
        }
        
        // Update session for rescheduling
        session.startTime = newStartTime
        session.endTime = newEndTime
        session.status = SessionStatus.PENDING // Reset to pending for teacher to confirm
        session.updatedAt = LocalDateTime.now()
        
        val savedSession = sessionRepository.save(session)
        notificationService.sendRescheduleNotification(savedSession)
        
        return SessionResponse.from(savedSession)
    }
    
    fun markSessionCompleted(sessionId: UUID, sessionNotes: String? = null): SessionResponse {
        val session = getSessionEntity(sessionId)
        
        if (session.status != SessionStatus.IN_PROGRESS && session.status != SessionStatus.CONFIRMED) {
            throw InvalidSessionOperationException("Only confirmed or in-progress sessions can be marked as completed")
        }
        
        // Update session for completion
        session.status = SessionStatus.COMPLETED
        session.sessionNotes = sessionNotes
        session.updatedAt = LocalDateTime.now()
        
        val savedSession = sessionRepository.save(session)
        notificationService.sendCompletionNotification(savedSession)
        
        return SessionResponse.from(savedSession)
    }
    
    private fun getSessionEntity(sessionId: UUID): Session {
        return sessionRepository.findById(sessionId)
            .orElseThrow { SessionNotFoundException("Session not found with id: $sessionId") }
    }
}