package com.cle.sessionbooking

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SessionBookingApplication

fun main(args: Array<String>) {
    runApplication<SessionBookingApplication>(*args)
}