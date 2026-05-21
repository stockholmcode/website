package com.cle.sessionbooking.repository

import com.cle.sessionbooking.model.User
import com.cle.sessionbooking.model.UserType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, UUID> {
    fun findByEmail(email: String): Optional<User>
    fun findByGoogleId(googleId: String): Optional<User>
    fun findByUserType(userType: UserType): List<User>
    fun existsByEmail(email: String): Boolean
}