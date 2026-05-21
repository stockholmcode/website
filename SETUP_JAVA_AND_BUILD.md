# Java Setup and Build Instructions

## The Problem
You're getting a compilation error because Java isn't properly installed or configured.

## Quick Solutions

### Option 1: Install Java 17+ (Recommended)

#### Using Homebrew (macOS):
```bash
# Install Java 17
brew install openjdk@17

# Set JAVA_HOME
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@17' >> ~/.zshrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Verify installation
java -version
javac -version
```

#### Alternative: Download Manually
1. Visit https://adoptium.net/temurin/releases/
2. Download Java 17 for macOS
3. Install the .pkg file
4. Set JAVA_HOME in your shell profile

### Option 2: Use Docker (If Java installation fails)

Create a Dockerfile for the backend:

```dockerfile
# Create file: /Users/nivinfakih/Documents/cle/Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app
COPY . .

RUN chmod +x ./gradlew
RUN ./gradlew build -x test

EXPOSE 8080

CMD ["./gradlew", "bootRun"]
```

Then run:
```bash
cd /Users/nivinfakih/Documents/cle
docker build -t cle-backend .
docker run -p 8080:8080 cle-backend
```

### Option 3: Use Pre-built JAR (If you have Java runtime only)

If you can get the JAR file compiled elsewhere, you can run it with just a Java runtime:

```bash
# Build on another machine or CI/CD, then copy the JAR
java -jar build/libs/session-booking-0.0.1-SNAPSHOT.jar
```

### Option 4: Simplified Local Development Setup

Create a simplified version using H2 database only:

```bash
# Check if Java runtime exists
/usr/libexec/java_home -V

# If you see Java listed, set JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH=$JAVA_HOME/bin:$PATH

# Try building again
cd /Users/nivinfakih/Documents/cle
./gradlew clean build
```

## Troubleshooting Build Issues

### 1. Check Java Installation
```bash
which java
java -version
which javac
javac -version
echo $JAVA_HOME
```

### 2. Clear Gradle Cache
```bash
cd /Users/nivinfakih/Documents/cle
./gradlew clean
rm -rf ~/.gradle/caches
./gradlew build
```

### 3. Specific Compilation Errors

If you're still getting Kotlin compilation errors after Java is installed, try:

```bash
cd /Users/nivinfakih/Documents/cle
./gradlew compileKotlin --info
```

Common fixes:
- UUID generation issues → Fixed in the updated code
- Missing imports → All imports have been added
- Version compatibility → Spring Boot 3.2.0 with Java 17+

### 4. Alternative: Use Online IDE

If local setup continues to fail, you can:

1. **GitHub Codespaces**: Open this repository in GitHub Codespaces
2. **Gitpod**: Use https://gitpod.io with this repository
3. **Cloud IDE**: Use any cloud-based IDE that supports Java/Kotlin

## Testing Your Setup

Once Java is installed and the project builds:

```bash
# 1. Build the project
cd /Users/nivinfakih/Documents/cle
./gradlew build

# 2. Run the application
./gradlew bootRun

# 3. Test in another terminal
curl http://localhost:8080/api/v1/test/health
```

Expected output:
```json
{"status":"OK","timestamp":1234567890,"userCount":4}
```

## Quick Test Without Full Build

If you want to test the login functionality immediately, I can provide a simple standalone Spring Boot application that you can run:

```bash
# Create a minimal test server
curl -O https://start.spring.io/starter.zip \
  -d type=gradle-project \
  -d language=kotlin \
  -d bootVersion=3.2.0 \
  -d groupId=com.cle \
  -d artifactId=test-server \
  -d name=test-server \
  -d packageName=com.cle.test \
  -d dependencies=web,security,data-jpa,h2

unzip starter.zip
cd test-server
```

## Status Check Commands

Run these to check your current status:

```bash
echo "=== JAVA STATUS ==="
java -version 2>&1 || echo "Java not found"
echo $JAVA_HOME

echo "=== GRADLE STATUS ==="
cd /Users/nivinfakih/Documents/cle
./gradlew --version 2>&1 || echo "Gradle failed"

echo "=== BUILD TEST ==="
./gradlew tasks 2>&1 | head -5 || echo "Gradle tasks failed"
```

## Next Steps

1. **Install Java 17+** using one of the methods above
2. **Verify installation** with `java -version`
3. **Build the project** with `./gradlew build`
4. **Run the server** with `./gradlew bootRun`
5. **Test authentication** with the provided curl commands

## Alternative: Frontend-Only Development

If backend setup continues to be problematic, you can:

1. **Use the existing frontend dataStore** (already working)
2. **Mock the API responses** in the frontend
3. **Deploy the backend to a cloud service** (Heroku, Railway, etc.)
4. **Focus on frontend development** while backend deployment is handled separately

Let me know which approach you'd like to try, and I can provide more specific guidance!