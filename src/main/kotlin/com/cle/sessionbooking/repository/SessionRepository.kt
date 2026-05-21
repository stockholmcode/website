package com.cle.sessionbooking.repository

import com.cle.sessionbooking.model.Session
import com.cle.sessionbooking.model.SessionStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*

@Repository
interface SessionRepository : JpaRepository<Session, UUID> {
    
    fun findByTeacherIdAndStartTimeBetween(
        teacherId: UUID,
        startTime: LocalDateTime,
        endTime: LocalDateTime
    ): List<Session>
    
    fun findByLearnerIdAndStartTimeBetween(
        learnerId: UUID,
        startTime: LocalDateTime,
        endTime: LocalDateTime
    ): List<Session>
    
    fun findByTeacherIdAndStatus(teacherId: UUID, status: SessionStatus): List<Session>
    
    fun findByLearnerIdAndStatus(learnerId: UUID, status: SessionStatus): List<Session>
    
    @Query("""
        SELECT s FROM Session s 
        WHERE s.teacherId = :teacherId 
        AND s.startTime <= :endTime 
        AND s.endTime >= :startTime 
        AND s.status NOT IN ('CANCELLED', 'NO_SHOW')
    """)
    fun findConflictingSessions(
        @Param("teacherId") teacherId: UUID,
        @Param("startTime") startTime: LocalDateTime,
        @Param("endTime") endTime: LocalDateTime
    ): List<Session>
    
    @Query("""
        SELECT s FROM Session s 
        WHERE (s.teacherId = :userId OR s.learnerId = :userId)
        AND s.startTime >= :fromDate
        ORDER BY s.startTime ASC
    """)
    fun findUpcomingSessionsForUser(
        @Param("userId") userId: UUID,
        @Param("fromDate") fromDate: LocalDateTime
    ): List<Session>
}