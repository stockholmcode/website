package com.cle.sessionbooking.service

import com.cle.sessionbooking.model.*
import com.cle.sessionbooking.repository.CourseRepository
import com.cle.sessionbooking.repository.SessionRepository
import com.cle.sessionbooking.repository.TeacherAvailabilityRepository
import com.cle.sessionbooking.repository.UserRepository
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class DataInitializationService(
    private val userRepository: UserRepository,
    private val courseRepository: CourseRepository,
    private val sessionRepository: SessionRepository,
    private val availabilityRepository: TeacherAvailabilityRepository,
    private val passwordEncoder: PasswordEncoder
) : ApplicationRunner {

    override fun run(args: ApplicationArguments?) {
        if (userRepository.count() == 0L) {
            initializeData()
        }
    }

    private fun initializeData() {
        // Create sample teachers
        val teachers = createSampleTeachers()
        
        // Create sample courses
        createSampleCourses(teachers)
        
        println("Sample data initialized successfully!")
    }

    private fun createSampleTeachers(): List<User> {
        // Create test accounts first
        val testUsers = listOf(
            User(
                email = "testteacher@example.com",
                name = "Test Teacher",
                userType = UserType.TEACHER,
                passwordHash = passwordEncoder.encode("password123"),
                authProvider = AuthProvider.EMAIL,
                isVerified = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            ),
            User(
                email = "testlearner@example.com",
                name = "Test Learner",
                userType = UserType.LEARNER,
                passwordHash = passwordEncoder.encode("password123"),
                authProvider = AuthProvider.EMAIL,
                isVerified = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        )
        
        val teachers = listOf(
            User(
                email = "alex.johnson@email.com",
                name = "Alex Johnson",
                userType = UserType.TEACHER,
                passwordHash = passwordEncoder.encode("password123"),
                authProvider = AuthProvider.EMAIL,
                isVerified = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            ),
            User(
                email = "sarah.mitchell@email.com",
                name = "Sarah Mitchell",
                userType = UserType.TEACHER,
                passwordHash = passwordEncoder.encode("password123"),
                authProvider = AuthProvider.EMAIL,
                isVerified = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            ),
            User(
                email = "michael.chen@email.com",
                name = "Michael Chen",
                userType = UserType.TEACHER,
                passwordHash = passwordEncoder.encode("password123"),
                authProvider = AuthProvider.EMAIL,
                isVerified = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            ),
            User(
                email = "emma.garcia@email.com",
                name = "Emma Garcia",
                userType = UserType.TEACHER,
                passwordHash = passwordEncoder.encode("password123"),
                authProvider = AuthProvider.EMAIL,
                isVerified = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        )

        // Save test users and teachers
        userRepository.saveAll(testUsers)
        return userRepository.saveAll(teachers)
    }

    private fun createSampleCourses(teachers: List<User>) {
        val alexJohnson = teachers.find { it.name == "Alex Johnson" }!!
        val sarahMitchell = teachers.find { it.name == "Sarah Mitchell" }!!
        val michaelChen = teachers.find { it.name == "Michael Chen" }!!
        val emmaGarcia = teachers.find { it.name == "Emma Garcia" }!!

        val courses = listOf(
            // Alex Johnson's Guitar courses
            Course(
                teacherId = alexJohnson.id!!,
                title = "Beginner Guitar Fundamentals",
                description = "Learn the basics of guitar playing including chords, strumming patterns, and simple songs. Perfect for complete beginners.",
                skillName = "Guitar",
                cost = BigDecimal("50.00"),
                duration = 60,
                format = SessionFormat.IN_PERSON,
                prerequisites = "No experience required",
                learningObjectives = listOf(
                    "Master basic chord shapes (G, C, D, Em)",
                    "Learn proper strumming techniques",
                    "Play 3 simple songs"
                ),
                isActive = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            ),
            Course(
                teacherId = alexJohnson.id!!,
                title = "Advanced Guitar Techniques",
                description = "Master advanced guitar techniques including barre chords, fingerpicking, and music theory. Build on your existing skills.",
                skillName = "Guitar",
                cost = BigDecimal("70.00"),
                duration = 90,
                format = SessionFormat.IN_PERSON,
                prerequisites = "Basic chord knowledge required",
                learningObjectives = listOf(
                    "Master barre chords and advanced progressions",
                    "Learn fingerpicking patterns",
                    "Understand music theory basics"
                ),
                isActive = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            ),
            
            // Sarah Mitchell's Python course
            Course(
                teacherId = sarahMitchell.id!!,
                title = "Python Programming for Beginners",
                description = "Start your programming journey with Python. Learn variables, functions, loops, and build your first applications.",
                skillName = "Python Programming",
                cost = BigDecimal("75.00"),
                duration = 90,
                format = SessionFormat.ONLINE,
                prerequisites = "Basic computer skills",
                learningObjectives = listOf(
                    "Understand Python syntax and variables",
                    "Write functions and control structures",
                    "Build simple applications"
                ),
                isActive = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            ),
            
            // Michael Chen's Spanish course
            Course(
                teacherId = michaelChen.id!!,
                title = "Spanish Conversation Practice",
                description = "Improve your Spanish speaking skills through guided conversation practice. Focus on everyday situations and build confidence.",
                skillName = "Spanish",
                cost = BigDecimal("45.00"),
                duration = 60,
                format = SessionFormat.HYBRID,
                prerequisites = "Basic Spanish knowledge",
                learningObjectives = listOf(
                    "Practice everyday conversations",
                    "Improve pronunciation and fluency",
                    "Learn colloquial expressions"
                ),
                isActive = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            ),
            
            // Emma Garcia's Yoga course
            Course(
                teacherId = emmaGarcia.id!!,
                title = "Yoga for Beginners",
                description = "Start your yoga journey with gentle poses, breathing techniques, and mindfulness practices. Perfect for complete beginners.",
                skillName = "Yoga",
                cost = BigDecimal("40.00"),
                duration = 75,
                format = SessionFormat.IN_PERSON,
                prerequisites = "No experience required",
                learningObjectives = listOf(
                    "Learn basic yoga poses and alignment",
                    "Practice breathing techniques",
                    "Develop flexibility and mindfulness"
                ),
                isActive = true,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
            )
        )

        val savedCourses = courseRepository.saveAll(courses)
        
        // Create availabilities for each course
        createSampleAvailabilities(savedCourses)
    }

    private fun createSampleAvailabilities(courses: List<Course>) {
        val availabilities = mutableListOf<TeacherAvailability>()

        courses.forEach { course ->
            when (course.title) {
                "Beginner Guitar Fundamentals" -> {
                    availabilities.addAll(listOf(
                        TeacherAvailability(
                            teacherId = course.teacherId,
                            courseId = course.id!!,
                            courseName = course.title,
                            date = LocalDate.now().plusDays(7),
                            startTime = LocalTime.of(10, 0),
                            endTime = LocalTime.of(11, 0),
                            maxStudents = 3,
                            location = "123 Music Studio, Room A",
                            isActive = true,
                            createdAt = LocalDateTime.now(),
                            updatedAt = LocalDateTime.now()
                        ),
                        TeacherAvailability(
                            teacherId = course.teacherId,
                            courseId = course.id!!,
                            courseName = course.title,
                            date = LocalDate.now().plusDays(8),
                            startTime = LocalTime.of(14, 0),
                            endTime = LocalTime.of(15, 0),
                            maxStudents = 3,
                            location = "123 Music Studio, Room A",
                            isActive = true,
                            createdAt = LocalDateTime.now(),
                            updatedAt = LocalDateTime.now()
                        )
                    ))
                }
                
                "Advanced Guitar Techniques" -> {
                    availabilities.add(
                        TeacherAvailability(
                            teacherId = course.teacherId,
                            courseId = course.id!!,
                            courseName = course.title,
                            date = LocalDate.now().plusDays(9),
                            startTime = LocalTime.of(19, 0),
                            endTime = LocalTime.of(20, 30),
                            maxStudents = 2,
                            location = "123 Music Studio, Room B",
                            isActive = true,
                            createdAt = LocalDateTime.now(),
                            updatedAt = LocalDateTime.now()
                        )
                    )
                }
                
                "Python Programming for Beginners" -> {
                    availabilities.add(
                        TeacherAvailability(
                            teacherId = course.teacherId,
                            courseId = course.id!!,
                            courseName = course.title,
                            date = LocalDate.now().plusDays(10),
                            startTime = LocalTime.of(18, 0),
                            endTime = LocalTime.of(19, 30),
                            maxStudents = 5,
                            virtualMeetingUrl = "https://meet.google.com/python-basics",
                            isActive = true,
                            createdAt = LocalDateTime.now(),
                            updatedAt = LocalDateTime.now()
                        )
                    )
                }
                
                "Spanish Conversation Practice" -> {
                    availabilities.addAll(listOf(
                        TeacherAvailability(
                            teacherId = course.teacherId,
                            courseId = course.id!!,
                            courseName = course.title,
                            date = LocalDate.now().plusDays(11),
                            startTime = LocalTime.of(16, 0),
                            endTime = LocalTime.of(17, 0),
                            maxStudents = 4,
                            location = "Language Center, Room 205",
                            virtualMeetingUrl = "https://meet.google.com/spanish-conversation",
                            isActive = true,
                            createdAt = LocalDateTime.now(),
                            updatedAt = LocalDateTime.now()
                        ),
                        TeacherAvailability(
                            teacherId = course.teacherId,
                            courseId = course.id!!,
                            courseName = course.title,
                            date = LocalDate.now().plusDays(12),
                            startTime = LocalTime.of(10, 0),
                            endTime = LocalTime.of(11, 0),
                            maxStudents = 4,
                            location = "Language Center, Room 205",
                            isActive = true,
                            createdAt = LocalDateTime.now(),
                            updatedAt = LocalDateTime.now()
                        )
                    ))
                }
                
                "Yoga for Beginners" -> {
                    availabilities.addAll(listOf(
                        TeacherAvailability(
                            teacherId = course.teacherId,
                            courseId = course.id!!,
                            courseName = course.title,
                            date = LocalDate.now().plusDays(13),
                            startTime = LocalTime.of(8, 0),
                            endTime = LocalTime.of(9, 15),
                            maxStudents = 8,
                            location = "Wellness Studio, Main Hall",
                            isActive = true,
                            createdAt = LocalDateTime.now(),
                            updatedAt = LocalDateTime.now()
                        ),
                        TeacherAvailability(
                            teacherId = course.teacherId,
                            courseId = course.id!!,
                            courseName = course.title,
                            date = LocalDate.now().plusDays(14),
                            startTime = LocalTime.of(17, 30),
                            endTime = LocalTime.of(18, 45),
                            maxStudents = 8,
                            location = "Wellness Studio, Main Hall",
                            isActive = true,
                            createdAt = LocalDateTime.now(),
                            updatedAt = LocalDateTime.now()
                        )
                    ))
                }
            }
        }

        availabilityRepository.saveAll(availabilities)
    }
}