# PowerPay API Live Test
# This tests the actual running API server

Write-Host "🔌 PowerPay API Live Testing" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

$baseUrl = "http://localhost:3001/api/v1"

# Test if server is running
Write-Host "🔍 Checking if API server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tokens/health" -Method GET -TimeoutSec 5
    Write-Host "✅ API Server is running!" -ForegroundColor Green
    Write-Host "Health check: $($response.status)"
} catch {
    Write-Host "❌ API Server is not running" -ForegroundColor Red
    Write-Host "Please start the server first with:" -ForegroundColor Yellow
    Write-Host "  cd apps\api && node dist/test-server.js"
    exit 1
}

Write-Host ""
Write-Host "🎫 Testing Token Generation API" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Prepare token request
$tokenRequest = @{
    meterNumber = "12345678901"
    disco = "IKEDC" 
    amount = 5000
    meterType = "prepaid"
} | ConvertTo-Json

Write-Host "📤 Sending token generation request..." -ForegroundColor Yellow
Write-Host $tokenRequest -ForegroundColor Gray

try {
    $token = Invoke-RestMethod -Uri "$baseUrl/tokens/generate" -Method POST -Body $tokenRequest -ContentType "application/json"
    
    Write-Host ""
    Write-Host "✅ TOKEN GENERATED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "🎫 Token: $($token.token)" -ForegroundColor White
    Write-Host "⚡ Units: $($token.units) kWh" -ForegroundColor Yellow
    Write-Host "💰 Amount: ₦$($token.amount)" -ForegroundColor Green
    Write-Host "🏢 DISCO: $($token.disco)" -ForegroundColor Blue
    Write-Host "� Meter: $($token.meterNumber)" -ForegroundColor Cyan
    Write-Host "🆔 Transaction ID: $($token.transactionId)" -ForegroundColor Gray
    Write-Host "📅 Expires: $($token.expiresAt)" -ForegroundColor Gray
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Token generation failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Testing Other Endpoints" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# Test supported DISCOs
Write-Host "📋 Getting supported DISCOs..." -ForegroundColor Yellow
try {
    $discos = Invoke-RestMethod -Uri "$baseUrl/tokens/discos" -Method GET
    Write-Host "✅ Supported DISCOs:" -ForegroundColor Green
    foreach ($disco in $discos.discos) {
        Write-Host "  • $disco" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Failed to get DISCOs" -ForegroundColor Red
}

# Test token validation (if we have a token)
if ($token -and $token.token) {
    Write-Host ""
    Write-Host "🔍 Validating generated token..." -ForegroundColor Yellow
    try {
        $validation = Invoke-RestMethod -Uri "$baseUrl/tokens/validate/$($token.token)" -Method GET
        Write-Host "✅ Token validation:" -ForegroundColor Green
        Write-Host "  Valid: $($validation.valid)" -ForegroundColor White
        Write-Host "  Message: $($validation.message)" -ForegroundColor White
    } catch {
        Write-Host "❌ Failed to validate token" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 API Testing Complete!" -ForegroundColor Green