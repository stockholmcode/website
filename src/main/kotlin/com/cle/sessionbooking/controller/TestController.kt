package com.cle.sessionbooking.controller

import com.cle.sessionbooking.repository.UserRepository
import com.cle.sessionbooking.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/test")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:3001"])
class TestController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @GetMapping("/users")
    fun getAllUsers(): ResponseEntity<Any> {
        val users = userRepository.findAll().map { user ->
            mapOf(
                "id" to user.id,
                "email" to user.email,
                "name" to user.name,
                "userType" to user.userType,
                "authProvider" to user.authProvider,
                "hasPassword" to !user.passwordHash.isNullOrBlank(),
                "isVerified" to user.isVerified
            )
        }
        return ResponseEntity.ok(mapOf(
            "totalUsers" to users.size,
            "users" to users
        ))
    }

    @PostMapping("/verify-password")
    fun verifyPassword(@RequestBody request: Map<String, String>): ResponseEntity<Any> {
        val email = request["email"] ?: return ResponseEntity.badRequest().body("Email required")
        val password = request["password"] ?: return ResponseEntity.badRequest().body("Password required")

        val user = userRepository.findByEmail(email).orElse(null)
            ?: return ResponseEntity.notFound().build()

        val passwordMatches = user.passwordHash?.let { hash ->
            passwordEncoder.matches(password, hash)
        } ?: false

        return ResponseEntity.ok(mapOf(
            "email" to user.email,
            "userType" to user.userType,
            "authProvider" to user.authProvider,
            "hasPasswordHash" to !user.passwordHash.isNullOrBlank(),
            "passwordMatches" to passwordMatches,
            "providedPassword" to password,
            "hashLength" to (user.passwordHash?.length ?: 0)
        ))
    }

    @GetMapping("/health")
    fun health(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(mapOf(
            "status" to "OK",
            "timestamp" to System.currentTimeMillis(),
            "userCount" to userRepository.count()
        ))
    }
}