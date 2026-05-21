package com.cle.sessionbooking.model

import jakarta.persistence.*
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.GenericGenerator
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "courses")
data class Course(
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID? = null,

    @Column(name = "teacher_id", nullable = false)
    val teacherId: UUID,

    @Column(nullable = false)
    @NotBlank
    val title: String,

    @Column(columnDefinition = "TEXT")
    @NotBlank
    val description: String,

    @Column(name = "skill_name", nullable = false)
    @NotBlank
    val skillName: String,

    @Column(nullable = false, precision = 10, scale = 2)
    @NotNull
    @Min(0)
    val cost: BigDecimal,

    @Column(nullable = false)
    @NotNull
    @Min(15)
    val duration: Int, // Duration in minutes

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val format: SessionFormat,

    @ElementCollection
    @CollectionTable(name = "course_images", joinColumns = [JoinColumn(name = "course_id")])
    @Column(name = "image_url")
    val images: List<String> = emptyList(),

    @Column(columnDefinition = "TEXT")
    val prerequisites: String? = null,

    @ElementCollection
    @CollectionTable(name = "course_learning_objectives", joinColumns = [JoinColumn(name = "course_id")])
    @Column(name = "objective")
    val learningObjectives: List<String> = emptyList(),

    @Column(name = "is_active", nullable = false)
    val isActive: Boolean = true,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now(),

    // Relationship with teacher
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    val teacher: User? = null,

    // One-to-many relationship with availabilities
    @OneToMany(mappedBy = "course", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val availabilities: List<TeacherAvailability> = emptyList()
)