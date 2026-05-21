package com.cle.sessionbooking.service

import com.cle.sessionbooking.dto.*
import com.cle.sessionbooking.model.AuthProvider
import com.cle.sessionbooking.model.User
import com.cle.sessionbooking.model.UserType
import com.cle.sessionbooking.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

@Service
@Transactional
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    fun authenticateUser(loginRequest: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(loginRequest.email)
            .orElseThrow { RuntimeException("Invalid credentials") }

        if (user.authProvider != AuthProvider.EMAIL) {
            throw RuntimeException("Please use ${user.authProvider.name.lowercase()} to login")
        }

        if (user.userType.name != loginRequest.userType.uppercase()) {
            throw RuntimeException("Invalid user type. Please select the correct account type.")
        }

        if (!passwordEncoder.matches(loginRequest.password, user.passwordHash)) {
            throw RuntimeException("Invalid credentials")
        }

        val token = jwtService.generateToken(user)
        
        return AuthResponse(
            token = token,
            user = user.toUserResponse(),
            expiresIn = jwtService.getExpirationTimeSeconds()
        )
    }

    fun registerUser(signUpRequest: SignUpRequest): AuthResponse {
        if (signUpRequest.password != signUpRequest.confirmPassword) {
            throw RuntimeException("Passwords do not match")
        }

        if (userRepository.existsByEmail(signUpRequest.email)) {
            throw RuntimeException("User with this email already exists")
        }

        val userType = try {
            UserType.valueOf(signUpRequest.userType.uppercase())
        } catch (e: IllegalArgumentException) {
            throw RuntimeException("Invalid user type")
        }

        val user = User(
            email = signUpRequest.email,
            name = "${signUpRequest.firstName} ${signUpRequest.lastName}",
            userType = userType,
            passwordHash = passwordEncoder.encode(signUpRequest.password),
            authProvider = AuthProvider.EMAIL,
            isVerified = true, // For demo purposes
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )

        val savedUser = userRepository.save(user)
        val token = jwtService.generateToken(savedUser)

        return AuthResponse(
            token = token,
            user = savedUser.toUserResponse(),
            expiresIn = jwtService.getExpirationTimeSeconds()
        )
    }

    fun authenticateWithGoogle(googleAuthRequest: GoogleAuthRequest): AuthResponse {
        // For demo purposes, we'll create a mock Google user
        // In production, you would validate the Google token and extract user info
        
        val userType = try {
            UserType.valueOf(googleAuthRequest.userType.uppercase())
        } catch (e: IllegalArgumentException) {
            throw RuntimeException("Invalid user type")
        }

        // Mock Google user data (in production, extract from Google token)
        val googleEmail = "user@gmail.com"
        val googleName = "Google User"
        val googleId = "google_${System.currentTimeMillis()}"

        // Check if user already exists
        val existingUser = userRepository.findByGoogleId(googleId).orElse(null)
            ?: userRepository.findByEmail(googleEmail).orElse(null)

        val user = if (existingUser != null) {
            if (existingUser.userType != userType) {
                throw RuntimeException("Account exists with different user type")
            }
            existingUser
        } else {
            val newUser = User(
                email = googleEmail,
                name = googleName,
                userType = userType,
                authProvider = AuthProvider.GOOGLE,
                googleId = googleId,
                isVerified = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
            userRepository.save(newUser)
        }

        val token = jwtService.generateToken(user)

        return AuthResponse(
            token = token,
            user = user.toUserResponse(),
            expiresIn = jwtService.getExpirationTimeSeconds()
        )
    }

    fun findByEmail(email: String): User? {
        return userRepository.findByEmail(email).orElse(null)
    }

    fun findById(id: UUID): User? {
        return userRepository.findById(id).orElse(null)
    }

    private fun User.toUserResponse(): UserResponse {
        return UserResponse(
            id = this.id!!.toString(),
            email = this.email,
            name = this.name,
            userType = this.userType,
            authProvider = this.authProvider.name,
            profilePicture = this.profilePicture,
            isVerified = this.isVerified,
            createdAt = this.createdAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            updatedAt = this.updatedAt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        )
    }
}