package com.cle.sessionbooking.model

import jakarta.persistence.*
import jakarta.validation.constraints.*
import org.hibernate.annotations.GenericGenerator
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "sessions")
class Session(
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID? = null,
    
    @Column(name = "teacher_id", nullable = false)
    val teacherId: UUID,
    
    @Column(name = "learner_id", nullable = false)
    val learnerId: UUID,
    
    @Column(name = "skill_name", nullable = false)
    @NotBlank
    @Size(max = 100)
    val skillName: String,

    @Column(name = "course_id")
    val courseId: UUID? = null,

    @Column(name = "course_name")
    val courseName: String? = null,
    
    @Column(nullable = false)
    @NotNull
    @Future
    var startTime: LocalDateTime,
    
    @Column(nullable = false)
    @NotNull
    @Future
    var endTime: LocalDateTime,
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val format: SessionFormat,
    
    @Column
    @Size(max = 500)
    val location: String? = null,
    
    @Column
    @Size(max = 500)
    val virtualMeetingUrl: String? = null,
    
    @Column(nullable = false, precision = 10, scale = 2)
    @DecimalMin("0.00")
    val price: BigDecimal,
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: SessionStatus = SessionStatus.PENDING,
    
    @Column(length = 1000)
    val learnerGoals: String? = null,
    
    @Column(length = 1000)
    val preparationNotes: String? = null,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
    
    @Column
    var cancelledAt: LocalDateTime? = null,
    
    @Column(length = 500)
    var cancellationReason: String? = null,
    
    @Column(length = 2000)
    var sessionNotes: String? = null,

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    val teacher: User? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", insertable = false, updatable = false)
    val learner: User? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", insertable = false, updatable = false)
    val course: Course? = null
) {
    @PreUpdate
    fun preUpdate() {
        this.updatedAt = LocalDateTime.now()
    }
    
    fun getDurationMinutes(): Long {
        return java.time.Duration.between(startTime, endTime).toMinutes()
    }
    
    fun isOnline(): Boolean = format == SessionFormat.ONLINE
    fun isInPerson(): Boolean = format == SessionFormat.IN_PERSON
    fun isHybrid(): Boolean = format == SessionFormat.HYBRID
    fun isCancellable(): Boolean = status in listOf(SessionStatus.PENDING, SessionStatus.CONFIRMED)
    fun isReschedulable(): Boolean = status in listOf(SessionStatus.PENDING, SessionStatus.CONFIRMED)
}