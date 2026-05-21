package com.cle.sessionbooking.dto

import com.cle.sessionbooking.model.UserType
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class LoginRequest(
    @field:Email(message = "Email should be valid")
    @field:NotBlank(message = "Email is required")
    val email: String,

    @field:NotBlank(message = "Password is required")
    val password: String,

    @field:NotBlank(message = "User type is required")
    val userType: String
)

data class SignUpRequest(
    @field:NotBlank(message = "First name is required")
    @field:Size(max = 50, message = "First name must be less than 50 characters")
    val firstName: String,

    @field:NotBlank(message = "Last name is required")
    @field:Size(max = 50, message = "Last name must be less than 50 characters")
    val lastName: String,

    @field:Email(message = "Email should be valid")
    @field:NotBlank(message = "Email is required")
    val email: String,

    @field:NotBlank(message = "Password is required")
    @field:Size(min = 8, message = "Password must be at least 8 characters")
    val password: String,

    @field:NotBlank(message = "Password confirmation is required")
    val confirmPassword: String,

    @field:NotBlank(message = "User type is required")
    val userType: String
)

data class GoogleAuthRequest(
    @field:NotBlank(message = "Google token is required")
    val googleToken: String,

    @field:NotBlank(message = "User type is required")
    val userType: String
)

data class AuthResponse(
    val token: String,
    val user: UserResponse,
    val expiresIn: Long = 3600
)

data class UserResponse(
    val id: String,
    val email: String,
    val name: String,
    val userType: UserType,
    val authProvider: String,
    val profilePicture: String? = null,
    val isVerified: Boolean,
    val createdAt: String,
    val updatedAt: String
)