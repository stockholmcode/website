package com.cle.sessionbooking.repository

import com.cle.sessionbooking.model.Course
import com.cle.sessionbooking.model.SessionFormat
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface CourseRepository : JpaRepository<Course, UUID> {
    fun findByTeacherId(teacherId: UUID): List<Course>
    fun findByTeacherIdAndIsActiveTrue(teacherId: UUID): List<Course>
    fun findBySkillNameContainingIgnoreCaseAndIsActiveTrue(skillName: String): List<Course>
    fun findByIsActiveTrue(): List<Course>
    
    @Query("""
        SELECT c FROM Course c 
        WHERE c.isActive = true 
        AND (:skillName IS NULL OR LOWER(c.skillName) LIKE LOWER(CONCAT('%', :skillName, '%')))
        AND (:format IS NULL OR c.format = :format)
        AND (:minPrice IS NULL OR c.cost >= :minPrice)
        AND (:maxPrice IS NULL OR c.cost <= :maxPrice)
    """)
    fun findCoursesWithFilters(
        @Param("skillName") skillName: String?,
        @Param("format") format: SessionFormat?,
        @Param("minPrice") minPrice: Double?,
        @Param("maxPrice") maxPrice: Double?
    ): List<Course>
}