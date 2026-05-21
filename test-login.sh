#!/bin/bash

echo "🔍 CLE Platform Login Test Script"
echo "=================================="

BASE_URL="http://localhost:8080/api/v1"

echo ""
echo "1. Testing backend health..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/test/health" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Backend is running"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Backend is NOT running"
    echo "   Please start with: cd /Users/nivinfakih/Documents/cle && ./gradlew bootRun"
    exit 1
fi

echo ""
echo "2. Checking sample users..."
USERS_RESPONSE=$(curl -s "$BASE_URL/test/users" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Users endpoint accessible"
    USER_COUNT=$(echo "$USERS_RESPONSE" | grep -o '"totalUsers":[0-9]*' | cut -d':' -f2)
    echo "   Total users: $USER_COUNT"
    if [ "$USER_COUNT" -gt 0 ]; then
        echo "✅ Sample users exist"
    else
        echo "❌ No users found - check data initialization"
    fi
else
    echo "❌ Cannot access users endpoint"
fi

echo ""
echo "3. Testing password verification..."
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/test/verify-password" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "alex.johnson@email.com",
        "password": "password123"
    }' 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ Password verification endpoint accessible"
    PASSWORD_MATCHES=$(echo "$VERIFY_RESPONSE" | grep -o '"passwordMatches":[^,]*' | cut -d':' -f2)
    echo "   Password matches: $PASSWORD_MATCHES"
    if [ "$PASSWORD_MATCHES" = "true" ]; then
        echo "✅ Password encoding/verification works"
    else
        echo "❌ Password verification failed"
        echo "   Full response: $VERIFY_RESPONSE"
    fi
else
    echo "❌ Cannot access password verification endpoint"
fi

echo ""
echo "4. Testing actual login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "alex.johnson@email.com",
        "password": "password123",
        "userType": "teacher"
    }' 2>/dev/null)

if [ $? -eq 0 ]; then
    if echo "$LOGIN_RESPONSE" | grep -q '"token"'; then
        echo "✅ LOGIN SUCCESSFUL!"
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        echo "   Token received: ${TOKEN:0:50}..."
    else
        echo "❌ LOGIN FAILED"
        echo "   Response: $LOGIN_RESPONSE"
    fi
else
    echo "❌ Cannot access login endpoint"
fi

echo ""
echo "5. Quick test with all sample accounts..."
ACCOUNTS=(
    "alex.johnson@email.com:teacher"
    "sarah.mitchell@email.com:teacher"
    "michael.chen@email.com:teacher"
    "emma.garcia@email.com:teacher"
)

for account in "${ACCOUNTS[@]}"; do
    IFS=':' read -r email usertype <<< "$account"
    echo "   Testing $email as $usertype..."
    
    RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"password123\",
            \"userType\": \"$usertype\"
        }" 2>/dev/null)
    
    if echo "$RESPONSE" | grep -q '"token"'; then
        echo "   ✅ Success"
    else
        echo "   ❌ Failed: $(echo $RESPONSE | cut -c1-100)..."
    fi
done

echo ""
echo "🎯 Quick Fix Commands:"
echo "   Start backend: cd /Users/nivinfakih/Documents/cle && ./gradlew bootRun"
echo "   View H2 DB: http://localhost:8080/h2-console"
echo "   Test health: curl http://localhost:8080/api/v1/test/health"
echo ""
echo "📧 Sample credentials to try:"
echo "   Email: alex.johnson@email.com"
echo "   Password: password123"
echo "   User Type: teacher"