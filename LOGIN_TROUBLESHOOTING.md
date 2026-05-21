# CLE Platform Login Troubleshooting Guide

## 🚨 "Invalid email or password" Error Solutions

### Quick Fixes

#### 1. **Use Sample Account Credentials**
Try logging in with the pre-created sample accounts:

**Teachers:**
- Email: `alex.johnson@email.com` | Password: `password123` | User Type: `teacher`
- Email: `sarah.mitchell@email.com` | Password: `password123` | User Type: `teacher`
- Email: `michael.chen@email.com` | Password: `password123` | User Type: `teacher`
- Email: `emma.garcia@email.com` | Password: `password123` | User Type: `teacher`

**Test the exact credentials:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.johnson@email.com",
    "password": "password123",
    "userType": "teacher"
  }'
```

#### 2. **Check User Type Matching**
Make sure the `userType` field matches exactly:
- Use `"teacher"` (lowercase) for teachers
- Use `"learner"` (lowercase) for learners

#### 3. **Verify Backend is Running**
```bash
# Check if backend is running
curl http://localhost:8080/api/v1/test/health

# Expected response:
# {"status":"OK","timestamp":1234567890,"userCount":4}
```

#### 4. **Check Sample Data Loading**
```bash
# Verify sample users were created
curl http://localhost:8080/api/v1/test/users

# Should show 4 sample users with proper passwords
```

#### 5. **Test Password Verification**
```bash
# Test if password encoding/matching works
curl -X POST http://localhost:8080/api/v1/test/verify-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.johnson@email.com",
    "password": "password123"
  }'

# Should return: {"passwordMatches": true}
```

### Common Issues & Solutions

#### Issue 1: Backend Not Running
**Symptoms:** Connection refused, network errors
**Solution:**
```bash
cd /Users/nivinfakih/Documents/cle
./gradlew bootRun
# Wait for "Started SessionBookingApplication"
```

#### Issue 2: Sample Data Not Loaded
**Symptoms:** "User not found" or empty user list
**Solution:**
1. Stop the backend (Ctrl+C)
2. Restart: `./gradlew bootRun`
3. Check logs for "Sample data initialized successfully!"

#### Issue 3: Frontend API URL Wrong
**Symptoms:** Network errors in browser console
**Solution:**
Update frontend API base URL:
```typescript
// frontend/src/services/backendApi.ts
private baseUrl = 'http://localhost:8080/api/v1';
```

#### Issue 4: Case Sensitivity Issues
**Symptoms:** "Invalid user type" error
**Solution:**
Use lowercase user types:
```json
{
  "email": "alex.johnson@email.com",
  "password": "password123",
  "userType": "teacher"  // lowercase
}
```

#### Issue 5: CORS Issues
**Symptoms:** CORS errors in browser console
**Solution:**
Backend is configured for `localhost:3000` and `localhost:3001`. If using different port:
1. Update CORS configuration in `SecurityConfig.kt`
2. Or start frontend on port 3000: `npm start`

### Step-by-Step Debugging

#### Step 1: Verify Backend Health
```bash
curl http://localhost:8080/api/v1/test/health
```
Expected: `{"status":"OK","userCount":4}`

#### Step 2: Check Sample Users
```bash
curl http://localhost:8080/api/v1/test/users
```
Expected: List of 4 users with `hasPassword: true`

#### Step 3: Test Direct Login API
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.johnson@email.com",
    "password": "password123",
    "userType": "teacher"
  }'
```
Expected: `{"token":"...", "user":{...}, "expiresIn":3600}`

#### Step 4: Test Frontend API Call
Open browser console and run:
```javascript
fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'alex.johnson@email.com',
    password: 'password123',
    userType: 'teacher'
  })
}).then(r => r.json()).then(console.log)
```

### Database Console Verification

Access H2 Console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

Run SQL query:
```sql
SELECT email, name, user_type, auth_provider, is_verified, 
       CASE WHEN password_hash IS NOT NULL THEN 'YES' ELSE 'NO' END as has_password
FROM users;
```

Expected result: 4 users with `has_password = YES`

### Create New Account Test

If sample accounts don't work, try creating a new account:

#### Via API:
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123",
    "userType": "teacher"
  }'
```

#### Then Login:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "userType": "teacher"
  }'
```

### Backend Logs Analysis

Check the backend console output for:

1. **Successful startup:**
   ```
   Started SessionBookingApplication in X.XXX seconds
   Sample data initialized successfully!
   ```

2. **Authentication attempts:**
   ```
   DEBUG - Processing login request for: alex.johnson@email.com
   ```

3. **Error messages:**
   ```
   ERROR - Authentication failed: Invalid credentials
   ```

### Frontend-Specific Issues

#### Check Network Tab in Browser DevTools:
1. Login attempt should show POST to `/auth/login`
2. Status should be 200 (success) or 401 (auth failed)
3. Response should contain token or error message

#### Common Frontend Fixes:

1. **Update LoginPage.tsx** if still using mock authentication
2. **Check API service** configuration
3. **Verify request format** matches backend expectations

### Emergency Reset

If nothing works, restart everything:

```bash
# 1. Stop backend (Ctrl+C)
# 2. Stop frontend (Ctrl+C)
# 3. Clear any cached data
rm -rf /Users/nivinfakih/Documents/cle/build

# 4. Restart backend
cd /Users/nivinfakih/Documents/cle
./gradlew clean bootRun

# 5. In new terminal, restart frontend
cd /Users/nivinfakih/Documents/cle/frontend
npm start
```

### Success Indicators

✅ Backend health check returns 200
✅ Sample users visible in database/API
✅ Password verification test passes
✅ Direct API login call succeeds
✅ Frontend can authenticate and receive token

### Still Having Issues?

1. **Check Java version:** `java -version` (should be 17+)
2. **Check port availability:** `lsof -i :8080`
3. **Check backend logs** for specific error messages
4. **Verify frontend is calling correct API endpoints**

---

**Quick Test Command:**
```bash
# This should work immediately after backend startup:
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex.johnson@email.com","password":"password123","userType":"teacher"}'
```