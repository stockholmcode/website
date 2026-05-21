package com.cle.sessionbooking.config

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Contact
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.License
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import io.swagger.v3.oas.models.servers.Server
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun customOpenAPI(): OpenAPI {
        return OpenAPI()
            .info(
                Info()
                    .title("Community Learning Exchange (CLE) API")
                    .description("""
                        API specification for the Community Learning Exchange platform that connects learners with teachers.
                        
                        ## Features
                        - User authentication (email/password and JWT tokens)
                        - Course management for teachers
                        - Availability scheduling
                        - Session booking and management
                        - Teacher search and discovery
                        - Real-time messaging and communication
                        
                        ## Authentication
                        Most endpoints require authentication via JWT token in the Authorization header.
                        Use the login endpoint to obtain a JWT token, then include it in the Authorization header as 'Bearer {token}'.
                    """.trimIndent())
                    .version("1.0.0")
                    .contact(
                        Contact()
                            .name("CLE Platform")
                            .email("support@cle-platform.com")
                    )
                    .license(
                        License()
                            .name("MIT")
                            .url("https://opensource.org/licenses/MIT")
                    )
            )
            .servers(
                listOf(
                    Server().url("http://localhost:8080").description("Local development server"),
                    Server().url("https://api.cle-platform.com").description("Production server")
                )
            )
            .addSecurityItem(SecurityRequirement().addList("bearerAuth"))
            .components(
                Components()
                    .addSecuritySchemes(
                        "bearerAuth",
                        SecurityScheme()
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                            .description("JWT token for authentication. Login to get a token, then use it as 'Bearer {token}'")
                    )
            )
    }
}