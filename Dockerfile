FROM openjdk:17-jdk-alpine

WORKDIR /app

# Copy gradle files
COPY build.gradle.kts .
COPY gradlew .
COPY gradle gradle

# Copy source code
COPY src src

# Make gradlew executable
RUN chmod +x gradlew

# Build the application
RUN ./gradlew build -x test

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "build/libs/session-booking-0.0.1-SNAPSHOT.jar"]