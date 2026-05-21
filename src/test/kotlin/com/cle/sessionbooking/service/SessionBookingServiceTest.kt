package com.cle.sessionbooking.service

import com.cle.sessionbooking.dto.SessionBookingRequest
import com.cle.sessionbooking.exception.SessionConflictException
import com.cle.sessionbooking.model.Session
import com.cle.sessionbooking.model.SessionFormat
import com.cle.sessionbooking.model.SessionStatus
import com.cle.sessionbooking.repository.SessionRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.*
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*

@SpringBootTest
@TestPropertySource(properties = ["spring.mail.host=localhost", "spring.mail.port=25"])
class SessionBookingServiceTest {
    
    private val sessionRepository: SessionRepository = mock()
    private val availabilityService: AvailabilityService = mock()
    private val notificationService: NotificationService = mock()
    
    private val sessionBookingService = SessionBookingService(
        sessionRepository,
        availabilityService,
        notificationService
    )
    
    @Test
    fun `should book session when teacher is available and no conflicts`() {
        // Given
        val request = SessionBookingRequest(
            teacherId = UUID.randomUUID(),
            learnerId = UUID.randomUUID(),
            skillName = "Kotlin Programming",
            startTime = LocalDateTime.now().plusDays(1),
            endTime = LocalDateTime.now().plusDays(1).plusHours(1),
            format = SessionFormat.ONLINE,
            virtualMeetingUrl = "https://meet.google.com/test",
            price = BigDecimal("50.00")
        )
        
        val expectedSession = Session(
            teacherId = request.teacherId,
            learnerId = request.learnerId,
            skillName = request.skillName,
            startTime = request.startTime,
            endTime = request.endTime,
            format = request.format,
            virtualMeetingUrl = request.virtualMeetingUrl,
            price = request.price,
            status = SessionStatus.PENDING
        )
        
        whenever(availabilityService.isTeacherAvailable(any(), any(), any())).thenReturn(true)
        whenever(sessionRepository.findConflictingSessions(any(), any(), any())).thenReturn(emptyList())
        whenever(sessionRepository.save(any<Session>())).thenReturn(expectedSession)
        
        // When
        val result = sessionBookingService.bookSession(request)
        
        // Then
        verify(sessionRepository).save(any<Session>())
        verify(notificationService).sendBookingConfirmation(any())
        assertEquals("Kotlin Programming", result.skillName)
        assertEquals(SessionStatus.PENDING, result.status)
    }
    
    @Test
    fun `should throw SessionConflictException when teacher has conflicting session`() {
        // Given
        val request = SessionBookingRequest(
            teacherId = UUID.randomUUID(),
            learnerId = UUID.randomUUID(),
            skillName = "Kotlin Programming",
            startTime = LocalDateTime.now().plusDays(1),
            endTime = LocalDateTime.now().plusDays(1).plusHours(1),
            format = SessionFormat.ONLINE,
            virtualMeetingUrl = "https://meet.google.com/test",
            price = BigDecimal("50.00")
        )
        
        val conflictingSession = Session(
            teacherId = request.teacherId,
            learnerId = UUID.randomUUID(),
            skillName = "Other Skill",
            startTime = request.startTime,
            endTime = request.endTime,
            format = SessionFormat.ONLINE,
            price = BigDecimal("40.00")
        )
        
        whenever(availabilityService.isTeacherAvailable(any(), any(), any())).thenReturn(true)
        whenever(sessionRepository.findConflictingSessions(any(), any(), any())).thenReturn(listOf(conflictingSession))
        
        // When & Then
        assertThrows<SessionConflictException> {
            sessionBookingService.bookSession(request)
        }
        
        verify(sessionRepository, never()).save(any<Session>())
        verify(notificationService, never()).sendBookingConfirmation(any())
    }
}