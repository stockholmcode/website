package com.cle.sessionbooking.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "messages")
class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

    @Column(nullable = false)
    var sessionId: UUID = UUID.randomUUID()

    @Column(nullable = false)
    var senderId: UUID = UUID.randomUUID()

    @Column(nullable = false)
    var receiverId: UUID = UUID.randomUUID()

    @Column(nullable = false, length = 1000)
    var content: String = ""

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var messageType: MessageType = MessageType.TEXT

    var isRead: Boolean = false

    @Column(nullable = false)
    var sentAt: LocalDateTime = LocalDateTime.now()

    var readAt: LocalDateTime? = null

    @PrePersist
    fun prePersist() {
        if (sentAt == LocalDateTime.MIN) {
            sentAt = LocalDateTime.now()
        }
    }
}