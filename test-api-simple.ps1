# PowerPay API Live Test

Write-Host "PowerPay API Live Testing" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

$baseUrl = "http://localhost:3001/api/v1"

# Test health check
Write-Host "Checking if API server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/tokens/health" -Method GET -TimeoutSec 5
    Write-Host "API Server is running!" -ForegroundColor Green
    Write-Host "Health: $($response.status)"
} catch {
    Write-Host "API Server is not running" -ForegroundColor Red
    Write-Host "Start with: cd apps\api && node dist/test-server.js"
    exit 1
}

Write-Host ""
Write-Host "Testing Token Generation" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Token request
$tokenRequest = @{
    meterNumber = "12345678901"
    disco = "IKEDC" 
    amount = 5000
    meterType = "prepaid"
} | ConvertTo-Json

Write-Host "Sending token request..."
Write-Host $tokenRequest -ForegroundColor Gray

try {
    $token = Invoke-RestMethod -Uri "$baseUrl/tokens/generate" -Method POST -Body $tokenRequest -ContentType "application/json"
    
    Write-Host ""
    Write-Host "TOKEN GENERATED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "Token: $($token.token)" -ForegroundColor Whitezz
    Write-Host "Units: $($token.units) kWh" -ForegroundColor Yellow
    Write-Host "Amount: N$($token.amount)" -ForegroundColor Green
    Write-Host "DISCO: $($token.disco)" -ForegroundColor Blue
    Write-Host "Meter: $($token.meterNumber)" -ForegroundColor Cyan
    Write-Host "Transaction: $($token.transactionId)" -ForegroundColor Gray
    
    # Test token validation
    Write-Host ""
    Write-Host "Validating token..." -ForegroundColor Yellow
    $validation = Invoke-RestMethod -Uri "$baseUrl/tokens/validate/$($token.token)" -Method GET
    Write-Host "Valid: $($validation.valid)" -ForegroundColor Green
    Write-Host "Message: $($validation.message)" -ForegroundColor White
    
} catch {
    Write-Host "Token generation failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test DISCOs
Write-Host ""
Write-Host "Getting supported DISCOs..." -ForegroundColor Yellow
try {
    $discos = Invoke-RestMethod -Uri "$baseUrl/tokens/discos" -Method GET
    Write-Host "Supported DISCOs:" -ForegroundColor Green
    foreach ($disco in $discos.discos) {
        Write-Host "  - $disco" -ForegroundColor White
    }
} catch {
    Write-Host "Failed to get DISCOs" -ForegroundColor Red
}

Write-Host ""
Write-Host "API Testing Complete!" -ForegroundColor Green