package com.cle.sessionbooking.controller

import com.cle.sessionbooking.dto.SearchResultsResponse
import com.cle.sessionbooking.dto.SkillResponse
import com.cle.sessionbooking.dto.TeacherSearchRequest
import com.cle.sessionbooking.service.SearchService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/search")
@CrossOrigin(origins = ["http://localhost:3000", "http://localhost:3001"])
class SearchController(
    private val searchService: SearchService
) {

    @PostMapping("/teachers")
    fun searchTeachers(@Valid @RequestBody request: TeacherSearchRequest): ResponseEntity<SearchResultsResponse> {
        val results = searchService.searchTeachers(request)
        return ResponseEntity.ok(results)
    }

    @GetMapping("/skills")
    fun getAvailableSkills(): ResponseEntity<List<SkillResponse>> {
        val skills = searchService.getAvailableSkills()
        return ResponseEntity.ok(skills)
    }
}