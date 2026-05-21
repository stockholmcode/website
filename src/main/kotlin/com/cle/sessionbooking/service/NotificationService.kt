package com.cle.sessionbooking.service

import com.cle.sessionbooking.model.Session
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter

@Service
class NotificationService(
    private val mailSender: JavaMailSender,
    @Value("\${spring.mail.username:noreply@cle.com}") private val fromEmail: String
) {
    
    private val logger = LoggerFactory.getLogger(NotificationService::class.java)
    private val dateTimeFormatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' h:mm a")
    
    fun sendBookingConfirmation(session: Session) {
        try {
            // Send to learner
            sendEmail(
                to = "learner-${session.learnerId}@example.com", // In real app, fetch from user service
                subject = "Session Booking Confirmation - ${session.skillName}",
                body = buildBookingConfirmationEmail(session, isForLearner = true)
            )
            
            // Send to teacher
            sendEmail(
                to = "teacher-${session.teacherId}@example.com", // In real app, fetch from user service
                subject = "New Session Booking Request - ${session.skillName}",
                body = buildBookingConfirmationEmail(session, isForLearner = false)
            )
            
            logger.info("Booking confirmation emails sent for session ${session.id}")
        } catch (e: Exception) {
            logger.error("Failed to send booking confirmation emails for session ${session.id}", e)
        }
    }
    
    fun sendSessionConfirmation(session: Session) {
        try {
            sendEmail(
                to = "learner-${session.learnerId}@example.com",
                subject = "Session Confirmed - ${session.skillName}",
                body = buildSessionConfirmationEmail(session)
            )
            
            logger.info("Session confirmation email sent for session ${session.id}")
        } catch (e: Exception) {
            logger.error("Failed to send session confirmation email for session ${session.id}", e)
        }
    }
    
    fun sendCancellationNotification(session: Session) {
        try {
            // Send to both learner and teacher
            listOf(
                "learner-${session.learnerId}@example.com",
                "teacher-${session.teacherId}@example.com"
            ).forEach { email ->
                sendEmail(
                    to = email,
                    subject = "Session Cancelled - ${session.skillName}",
                    body = buildCancellationEmail(session)
                )
            }
            
            logger.info("Cancellation emails sent for session ${session.id}")
        } catch (e: Exception) {
            logger.error("Failed to send cancellation emails for session ${session.id}", e)
        }
    }
    
    fun sendRescheduleNotification(session: Session) {
        try {
            // Send to both learner and teacher
            listOf(
                "learner-${session.learnerId}@example.com",
                "teacher-${session.teacherId}@example.com"
            ).forEach { email ->
                sendEmail(
                    to = email,
                    subject = "Session Rescheduled - ${session.skillName}",
                    body = buildRescheduleEmail(session)
                )
            }
            
            logger.info("Reschedule emails sent for session ${session.id}")
        } catch (e: Exception) {
            logger.error("Failed to send reschedule emails for session ${session.id}", e)
        }
    }
    
    fun sendCompletionNotification(session: Session) {
        try {
            // Send to both learner and teacher
            listOf(
                "learner-${session.learnerId}@example.com",
                "teacher-${session.teacherId}@example.com"
            ).forEach { email ->
                sendEmail(
                    to = email,
                    subject = "Session Completed - ${session.skillName}",
                    body = buildCompletionEmail(session)
                )
            }
            
            logger.info("Completion emails sent for session ${session.id}")
        } catch (e: Exception) {
            logger.error("Failed to send completion emails for session ${session.id}", e)
        }
    }
    
    private fun sendEmail(to: String, subject: String, body: String) {
        val message = SimpleMailMessage().apply {
            setFrom(fromEmail)
            setTo(to)
            setSubject(subject)
            setText(body)
        }
        
        mailSender.send(message)
    }
    
    private fun buildBookingConfirmationEmail(session: Session, isForLearner: Boolean): String {
        val recipient = if (isForLearner) "learner" else "teacher"
        val action = if (isForLearner) "booked" else "requested"
        
        return """
            Hello,
            
            A learning session has been $action for ${session.skillName}.
            
            Session Details:
            - Date & Time: ${session.startTime.format(dateTimeFormatter)} - ${session.endTime.format(dateTimeFormatter)}
            - Format: ${session.format.name.lowercase().replace('_', ' ')}
            ${if (session.location != null) "- Location: ${session.location}" else ""}
            ${if (session.virtualMeetingUrl != null) "- Meeting URL: ${session.virtualMeetingUrl}" else ""}
            - Duration: ${session.getDurationMinutes()} minutes
            - Price: $${session.price}
            
            ${if (session.learnerGoals != null) "Learning Goals: ${session.learnerGoals}\n" else ""}
            ${if (session.preparationNotes != null) "Preparation Notes: ${session.preparationNotes}\n" else ""}
            
            ${if (isForLearner) "Your session is pending teacher confirmation. You will receive another email once confirmed." 
              else "Please confirm or decline this session request through your dashboard."}
            
            Best regards,
            Community Learning Exchange Team
        """.trimIndent()
    }
    
    private fun buildSessionConfirmationEmail(session: Session): String {
        return """
            Hello,
            
            Great news! Your learning session for ${session.skillName} has been confirmed by your teacher.
            
            Session Details:
            - Date & Time: ${session.startTime.format(dateTimeFormatter)} - ${session.endTime.format(dateTimeFormatter)}
            - Format: ${session.format.name.lowercase().replace('_', ' ')}
            ${if (session.location != null) "- Location: ${session.location}" else ""}
            ${if (session.virtualMeetingUrl != null) "- Meeting URL: ${session.virtualMeetingUrl}" else ""}
            
            Please make sure to be ready 5 minutes before the session starts.
            
            Best regards,
            Community Learning Exchange Team
        """.trimIndent()
    }
    
    private fun buildCancellationEmail(session: Session): String {
        return """
            Hello,
            
            Unfortunately, your learning session for ${session.skillName} scheduled for ${session.startTime.format(dateTimeFormatter)} has been cancelled.
            
            ${if (session.cancellationReason != null) "Reason: ${session.cancellationReason}\n" else ""}
            
            You can search for alternative sessions or reschedule with the same teacher through your dashboard.
            
            Best regards,
            Community Learning Exchange Team
        """.trimIndent()
    }
    
    private fun buildRescheduleEmail(session: Session): String {
        return """
            Hello,
            
            Your learning session for ${session.skillName} has been rescheduled.
            
            New Session Details:
            - Date & Time: ${session.startTime.format(dateTimeFormatter)} - ${session.endTime.format(dateTimeFormatter)}
            - Format: ${session.format.name.lowercase().replace('_', ' ')}
            ${if (session.location != null) "- Location: ${session.location}" else ""}
            ${if (session.virtualMeetingUrl != null) "- Meeting URL: ${session.virtualMeetingUrl}" else ""}
            
            The session is now pending confirmation again. You will receive another email once confirmed.
            
            Best regards,
            Community Learning Exchange Team
        """.trimIndent()
    }
    
    private fun buildCompletionEmail(session: Session): String {
        return """
            Hello,
            
            Your learning session for ${session.skillName} has been marked as completed.
            
            ${if (session.sessionNotes != null) "Session Notes: ${session.sessionNotes}\n" else ""}
            
            We hope you had a great learning experience! Please consider leaving a review for your teacher.
            
            Best regards,
            Community Learning Exchange Team
        """.trimIndent()
    }
}