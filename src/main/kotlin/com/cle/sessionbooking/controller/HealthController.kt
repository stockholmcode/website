package com.cle.sessionbooking.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/v1/health")
class HealthController {
    
    @GetMapping
    fun health(): ResponseEntity<Map<String, Any>> {
        val response = mapOf(
            "status" to "UP",
            "timestamp" to LocalDateTime.now(),
            "service" to "CLE Session Booking Service",
            "version" to "1.0.0"
        )
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/detailed")
    fun detailedHealth(): ResponseEntity<Map<String, Any>> {
        val response = mapOf(
            "status" to "UP",
            "timestamp" to LocalDateTime.now(),
            "service" to "CLE Session Booking Service",
            "version" to "1.0.0",
            "components" to mapOf(
                "database" to "UP",
                "email" to "UP",
                "notifications" to "UP"
            ),
            "endpoints" to listOf(
                "/api/v1/sessions",
                "/api/v1/availability",
                "/api/v1/health"
            )
        )
        return ResponseEntity.ok(response)
    }
}