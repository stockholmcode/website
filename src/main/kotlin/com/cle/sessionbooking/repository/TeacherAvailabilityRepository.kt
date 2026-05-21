package com.cle.sessionbooking.repository

import com.cle.sessionbooking.model.TeacherAvailability
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.*

@Repository
interface TeacherAvailabilityRepository : JpaRepository<TeacherAvailability, UUID> {
    
    fun findByTeacherIdAndIsActiveTrue(teacherId: UUID): List<TeacherAvailability>
    
    fun findByCourseIdAndIsActiveTrue(courseId: UUID): List<TeacherAvailability>
    
    fun findByTeacherIdAndCourseIdAndIsActiveTrue(teacherId: UUID, courseId: UUID): List<TeacherAvailability>
    
    fun findByDateAndIsActiveTrue(date: LocalDate): List<TeacherAvailability>
    
    fun findByTeacherIdAndDateAndIsActiveTrue(teacherId: UUID, date: LocalDate): List<TeacherAvailability>
    
    @Query("""
        SELECT ta FROM TeacherAvailability ta 
        WHERE ta.isActive = true 
        AND (:teacherId IS NULL OR ta.teacherId = :teacherId)
        AND (:courseId IS NULL OR ta.courseId = :courseId)
        AND (:date IS NULL OR ta.date = :date)
        ORDER BY ta.date ASC, ta.startTime ASC
    """)
    fun findAvailabilitiesWithFilters(
        @Param("teacherId") teacherId: UUID?,
        @Param("courseId") courseId: UUID?,
        @Param("date") date: LocalDate?
    ): List<TeacherAvailability>
}