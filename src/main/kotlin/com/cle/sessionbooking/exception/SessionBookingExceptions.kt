package com.cle.sessionbooking.exception

class SessionNotFoundException(message: String) : RuntimeException(message)

class SessionConflictException(message: String) : RuntimeException(message)

class InvalidSessionOperationException(message: String) : RuntimeException(message)

class TeacherUnavailableException(message: String) : RuntimeException(message)