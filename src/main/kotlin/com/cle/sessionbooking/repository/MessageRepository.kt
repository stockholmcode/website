package com.cle.sessionbooking.repository

import com.cle.sessionbooking.model.Message
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface MessageRepository : JpaRepository<Message, Long> {
    
    fun findBySessionIdOrderBySentAtAsc(sessionId: UUID): List<Message>
    
    @Query("SELECT m FROM Message m WHERE m.sessionId = :sessionId AND (m.senderId = :userId OR m.receiverId = :userId) ORDER BY m.sentAt ASC")
    fun findBySessionIdAndUserId(@Param("sessionId") sessionId: UUID, @Param("userId") userId: UUID): List<Message>
    
    @Query("SELECT m FROM Message m WHERE m.receiverId = :userId AND m.isRead = false")
    fun findUnreadMessagesByReceiver(@Param("userId") userId: UUID): List<Message>
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :userId AND m.isRead = false")
    fun countUnreadMessagesByReceiver(@Param("userId") userId: UUID): Long
    
    @Query("SELECT m FROM Message m WHERE (m.senderId = :userId OR m.receiverId = :userId) ORDER BY m.sentAt DESC")
    fun findConversationsByUser(@Param("userId") userId: UUID): List<Message>
}