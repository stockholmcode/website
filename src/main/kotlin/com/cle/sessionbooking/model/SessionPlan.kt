package com.cle.sessionbooking.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "session_plans")
class SessionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

    @Column(nullable = false, unique = true)
    var sessionId: UUID = UUID.randomUUID()

    @Column(length = 500)
    var learningObjectives: String? = null

    @Column(length = 1000)
    var materialsNeeded: String? = null

    @Column(length = 500)
    var locationDetails: String? = null

    @Column(length = 200)
    var emergencyContact: String? = null

    @Column(length = 1000)
    var specialInstructions: String? = null

    var isCompleted: Boolean = false

    @Column(nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()

    var updatedAt: LocalDateTime = LocalDateTime.now()

    @PrePersist
    fun prePersist() {
        val now = LocalDateTime.now()
        if (createdAt == LocalDateTime.MIN) {
            createdAt = now
        }
        updatedAt = now
    }

    @PreUpdate
    fun preUpdate() {
        updatedAt = LocalDateTime.now()
    }
}