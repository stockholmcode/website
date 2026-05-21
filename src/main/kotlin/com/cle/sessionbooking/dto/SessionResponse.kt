package com.cle.sessionbooking.dto

import com.cle.sessionbooking.model.Session
import com.cle.sessionbooking.model.SessionFormat
import com.cle.sessionbooking.model.SessionStatus
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*

data class SessionResponse(
    val id: UUID,
    val teacherId: UUID,
    val learnerId: UUID,
    val skillName: String,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime,
    val format: SessionFormat,
    val location: String?,
    val virtualMeetingUrl: String?,
    val price: BigDecimal,
    val status: SessionStatus,
    val learnerGoals: String?,
    val preparationNotes: String?,
    val sessionNotes: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val durationMinutes: Long,
    val isCancellable: Boolean,
    val isReschedulable: Boolean
) {
    companion object {
        fun from(session: Session): SessionResponse {
            return SessionResponse(
                id = session.id ?: UUID.randomUUID(),
                teacherId = session.teacherId,
                learnerId = session.learnerId,
                skillName = session.skillName,
                startTime = session.startTime,
                endTime = session.endTime,
                format = session.format,
                location = session.location,
                virtualMeetingUrl = session.virtualMeetingUrl,
                price = session.price,
                status = session.status,
                learnerGoals = session.learnerGoals,
                preparationNotes = session.preparationNotes,
                sessionNotes = session.sessionNotes,
                createdAt = session.createdAt,
                updatedAt = session.updatedAt,
                durationMinutes = session.getDurationMinutes(),
                isCancellable = session.isCancellable(),
                isReschedulable = session.isReschedulable()
            )
        }
    }
}