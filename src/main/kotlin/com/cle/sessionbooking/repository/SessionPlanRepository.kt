package com.cle.sessionbooking.repository

import com.cle.sessionbooking.model.SessionPlan
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface SessionPlanRepository : JpaRepository<SessionPlan, Long> {
    
    fun findBySessionId(sessionId: UUID): Optional<SessionPlan>
    
    fun existsBySessionId(sessionId: UUID): Boolean
}