package com.cle.sessionbooking.model

import jakarta.persistence.*
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.GenericGenerator
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.*

@Entity
@Table(name = "teacher_availability")
data class TeacherAvailability(
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID? = null,

    @Column(name = "teacher_id", nullable = false)
    var teacherId: UUID,

    @Column(name = "course_id", nullable = false)
    var courseId: UUID,

    @Column(name = "course_name", nullable = false)
    @NotBlank
    var courseName: String,

    @Column(nullable = false)
    @NotNull
    var date: LocalDate,

    @Column(name = "start_time", nullable = false)
    @NotNull
    var startTime: LocalTime,

    @Column(name = "end_time", nullable = false)
    @NotNull
    var endTime: LocalTime,

    @Column(name = "max_students", nullable = false)
    @Min(1)
    var maxStudents: Int,

    @Column(name = "location")
    var location: String? = null,

    @Column(name = "virtual_meeting_url")
    var virtualMeetingUrl: String? = null,

    @Column(name = "is_active", nullable = false)
    var isActive: Boolean = true,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    // Relationship with course
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", insertable = false, updatable = false)
    val course: Course? = null,

    // Relationship with teacher
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    val teacher: User? = null
)