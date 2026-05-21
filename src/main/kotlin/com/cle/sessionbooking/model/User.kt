package com.cle.sessionbooking.model

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import org.hibernate.annotations.GenericGenerator
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID? = null,

    @Column(unique = true, nullable = false)
    @Email
    @NotBlank
    val email: String,

    @Column(nullable = false)
    @NotBlank
    val name: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val userType: UserType,

    @Column(name = "password_hash")
    val passwordHash: String? = null,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val authProvider: AuthProvider,

    @Column(name = "google_id")
    val googleId: String? = null,

    @Column(name = "profile_picture")
    val profilePicture: String? = null,

    @Column(nullable = false)
    val isVerified: Boolean = false,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class UserType {
    TEACHER, LEARNER
}

enum class AuthProvider {
    EMAIL, GOOGLE
}