package com.cle.sessionbooking.controller

import com.cle.sessionbooking.dto.*
import com.cle.sessionbooking.service.UserService
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:3001"])
class AuthController(
    private val userService: UserService
) {

    @PostMapping("/login")
    fun login(@Valid @RequestBody loginRequest: LoginRequest): ResponseEntity<Any> {
        return try {
            val authResponse = userService.authenticateUser(loginRequest)
            ResponseEntity.ok(authResponse)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf(
                    "error" to "Authentication failed",
                    "message" to (e.message ?: "Invalid credentials"),
                    "code" to "AUTH_FAILED"
                ))
        }
    }

    @PostMapping("/signup")
    fun signup(@Valid @RequestBody signUpRequest: SignUpRequest): ResponseEntity<Any> {
        return try {
            val authResponse = userService.registerUser(signUpRequest)
            ResponseEntity.status(HttpStatus.CREATED).body(authResponse)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf(
                    "error" to "Registration failed",
                    "message" to (e.message ?: "Registration failed"),
                    "code" to "REGISTRATION_FAILED"
                ))
        }
    }

    @PostMapping("/google")
    fun googleAuth(@Valid @RequestBody googleAuthRequest: GoogleAuthRequest): ResponseEntity<Any> {
        return try {
            val authResponse = userService.authenticateWithGoogle(googleAuthRequest)
            ResponseEntity.ok(authResponse)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf(
                    "error" to "Google authentication failed",
                    "message" to (e.message ?: "Google authentication failed"),
                    "code" to "GOOGLE_AUTH_FAILED"
                ))
        }
    }

    @GetMapping("/me")
    fun getCurrentUser(request: HttpServletRequest): ResponseEntity<Any> {
        val userId = request.getAttribute("userId") as? String
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("error" to "Authentication required"))

        val user = userService.findById(UUID.fromString(userId))
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "User not found"))

        return ResponseEntity.ok(mapOf(
            "id" to user.id,
            "email" to user.email,
            "name" to user.name,
            "userType" to user.userType,
            "authProvider" to user.authProvider,
            "profilePicture" to user.profilePicture,
            "isVerified" to user.isVerified,
            "createdAt" to user.createdAt,
            "updatedAt" to user.updatedAt
        ))
    }
}