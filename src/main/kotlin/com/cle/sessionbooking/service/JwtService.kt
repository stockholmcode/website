package com.cle.sessionbooking.service

import com.cle.sessionbooking.model.User
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.Key
import java.util.*

@Service
class JwtService {

    @Value("\${jwt.secret:mySecretKey}")
    private lateinit var jwtSecret: String

    @Value("\${jwt.expiration:3600000}")
    private var jwtExpirationMs: Long = 3600000 // 1 hour

    private fun getSigningKey(): Key {
        return Keys.hmacShaKeyFor(jwtSecret.toByteArray())
    }

    fun generateToken(user: User): String {
        val now = Date()
        val expiryDate = Date(now.time + jwtExpirationMs)

        return Jwts.builder()
            .setSubject(user.id.toString())
            .claim("email", user.email)
            .claim("name", user.name)
            .claim("userType", user.userType.name)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact()
    }

    fun getUserIdFromToken(token: String): String? {
        return try {
            val claims = Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .body
            claims.subject
        } catch (e: Exception) {
            null
        }
    }

    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun getClaimsFromToken(token: String): Claims? {
        return try {
            Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .body
        } catch (e: Exception) {
            null
        }
    }

    fun getExpirationTimeSeconds(): Long {
        return jwtExpirationMs / 1000
    }

    fun getUserIdAsUUID(token: String): UUID? {
        return try {
            val userIdString = getUserIdFromToken(token)
            userIdString?.let { UUID.fromString(it) }
        } catch (e: Exception) {
            null
        }
    }
}