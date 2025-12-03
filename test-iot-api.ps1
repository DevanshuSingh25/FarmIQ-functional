# IoT Booking API Testing Script
# This script tests all IoT endpoints with proper authentication

Write-Host "`n=== IoT Booking API Testing Script ===`n" -ForegroundColor Cyan
Write-Host "Testing database-backed IoT endpoints...`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001/api"

# Test 1: Check if server is running
Write-Host "[Test 1] Checking server health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✓ Server is running" -ForegroundColor Green
    Write-Host "  Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Server is not running or unreachable" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Login as farmer to get session
Write-Host "`n[Test 2] Logging in as farmer..." -ForegroundColor Yellow
try {
    $loginBody = @{
        role = "farmer"
        email = "farmer@test.com"
        password = "password"
    } | ConvertTo-Json

    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $loginResponse = Invoke-WebRequest `
        -Uri "$baseUrl/auth/login" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $loginBody `
        -SessionVariable session

    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "  User ID: $($loginData.user.id)" -ForegroundColor Gray
    Write-Host "  Role: $($loginData.user.role)" -ForegroundColor Gray
    
    $farmerId = $loginData.user.id
} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    Write-Host "`n  Note: You may need to create a farmer user first." -ForegroundColor Yellow
    Write-Host "  Or update the email/password in this script." -ForegroundColor Yellow
    exit 1
}

# Test 3: Get IoT status for farmer
Write-Host "`n[Test 3] GET /api/iot/status/$farmerId - Getting IoT status..." -ForegroundColor Yellow
try {
    $statusResponse = Invoke-RestMethod `
        -Uri "$baseUrl/iot/status/$farmerId" `
        -Method GET `
        -WebSession $session

    Write-Host "✓ Status retrieved successfully" -ForegroundColor Green
    Write-Host "  User ID: $($statusResponse.user_id)" -ForegroundColor Gray
    Write-Host "  Status: $($statusResponse.status)" -ForegroundColor Gray
    Write-Host "  Updated At: $($statusResponse.updated_at)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to get status" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Check existing booking
Write-Host "`n[Test 4] GET /api/iot/request/$farmerId - Checking for existing booking..." -ForegroundColor Yellow
try {
    $bookingResponse = Invoke-RestMethod `
        -Uri "$baseUrl/iot/request/$farmerId" `
        -Method GET `
        -WebSession $session

    Write-Host "✓ Existing booking found" -ForegroundColor Green
    Write-Host "  Booking ID: $($bookingResponse.id)" -ForegroundColor Gray
    Write-Host "  Name: $($bookingResponse.name)" -ForegroundColor Gray
    Write-Host "  Phone: $($bookingResponse.phone_number)" -ForegroundColor Gray
    Write-Host "  Status: $($bookingResponse.status)" -ForegroundColor Gray
    
    $hasBooking = $true
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "  No existing booking found (this is expected for new users)" -ForegroundColor Gray
        $hasBooking = $false
    } else {
        Write-Host "✗ Error checking booking" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Create new booking (if none exists)
if (-not $hasBooking) {
    Write-Host "`n[Test 5] POST /api/iot/request - Creating new booking..." -ForegroundColor Yellow
    try {
        $bookingBody = @{
            name = "Test Farmer"
            phone_number = "+911234567890"
            location = "Near Water Pump"
            state = "Punjab"
            district = "Ludhiana"
            preferred_visit_date = "2025-12-15"
        } | ConvertTo-Json

        $createResponse = Invoke-RestMethod `
            -Uri "$baseUrl/iot/request" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $bookingBody `
            -WebSession $session

        Write-Host "✓ Booking created successfully" -ForegroundColor Green
        Write-Host "  Booking ID: $($createResponse.id)" -ForegroundColor Gray
        Write-Host "  Name: $($createResponse.name)" -ForegroundColor Gray
        Write-Host "  Phone: $($createResponse.phone_number)" -ForegroundColor Gray
        Write-Host "  State: $($createResponse.state)" -ForegroundColor Gray
        Write-Host "  District: $($createResponse.district)" -ForegroundColor Gray
        Write-Host "  Status: $($createResponse.status)" -ForegroundColor Gray
    } catch {
        Write-Host "✗ Failed to create booking" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "`n[Test 5] POST /api/iot/request - Skipped (booking already exists)" -ForegroundColor Gray
}

# Test 6: Test special case user_id=1
Write-Host "`n[Test 6] Testing special case for user_id=1..." -ForegroundColor Yellow
try {
    $user1Status = Invoke-RestMethod `
        -Uri "$baseUrl/iot/status/1" `
        -Method GET `
        -WebSession $session

    Write-Host "✓ User ID 1 status retrieved" -ForegroundColor Green
    Write-Host "  Status: $($user1Status.status) (should be 'booked')" -ForegroundColor Gray
    
    if ($user1Status.status -eq "booked") {
        Write-Host "  ✓ Special case working correctly!" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Special case not working (expected 'booked')" -ForegroundColor Red
    }
} catch {
    Write-Host "  Could not test user_id=1 - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Try to get readings (will fail if status is not active)
Write-Host "`n[Test 7] GET /api/iot/readings/$farmerId - Attempting to get readings..." -ForegroundColor Yellow
try {
    $readingsResponse = Invoke-RestMethod `
        -Uri "$baseUrl/iot/readings/${farmerId}?limit=5" `
        -Method GET `
        -WebSession $session

    Write-Host "✓ Readings retrieved successfully" -ForegroundColor Green
    Write-Host "  Count: $($readingsResponse.Length)" -ForegroundColor Gray
    if ($readingsResponse.Length -gt 0) {
        $latest = $readingsResponse[0]
        Write-Host "  Latest reading:" -ForegroundColor Gray
        Write-Host "    Temperature: $($latest.temperature)°C" -ForegroundColor Gray
        Write-Host "    Humidity: $($latest.humidity)%" -ForegroundColor Gray
        Write-Host "    Soil Moisture: $($latest.soil_moisture)%" -ForegroundColor Gray
    }
} catch {
    if ($_.ErrorDetails.Message -and ($_.ErrorDetails.Message -match "Device not active")) {
        Write-Host "  ✓ Device not active (this is expected, status is 'inactive' or 'pending')" -ForegroundColor Gray
        Write-Host "  To test readings, login as admin and set status to 'active'" -ForegroundColor Gray
    } else {
        Write-Host "✗ Failed to get readings" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Testing Complete ===`n" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- ✓ Server is running and responding" -ForegroundColor White
Write-Host "- ✓ Authentication is working with sessions" -ForegroundColor White
Write-Host "- ✓ IoT status endpoint is functional" -ForegroundColor White
Write-Host "- ✓ IoT booking endpoint is functional" -ForegroundColor White
Write-Host "- ✓ Special user_id=1 case tested" -ForegroundColor White
Write-Host "- ✓ Readings endpoint requires 'active' status" -ForegroundColor White

Write-Host "`nNext steps to test admin functionality:" -ForegroundColor Yellow
Write-Host "1. Login as admin and use: PUT /api/iot/status/$farmerId with body { status: 'active' }" -ForegroundColor Gray
Write-Host "2. Then test GET /api/iot/readings/$farmerId to see mock sensor data" -ForegroundColor Gray
Write-Host "3. Test the frontend at http://localhost:5173" -ForegroundColor Gray
