# PowerPay Token Generation Test
Write-Host "🔌 PowerPay Token Generation Test" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Test Token Generation
Write-Host "🎫 Generating Prepaid Token..." -ForegroundColor Yellow
Write-Host ""

$meterNumber = "12345678901"
$disco = "IKEDC"
$amount = 5000
$customerName = "Test Customer"

Write-Host "📋 Request Details:" -ForegroundColor Cyan
Write-Host "Meter Number: $meterNumber"
Write-Host "DISCO: $disco"
Write-Host "Amount: ₦$amount"
Write-Host "Customer: $customerName"
Write-Host ""

# Simulate token generation
$token = Get-Random -Minimum 10000000000000000000 -Maximum 99999999999999999999
$units = [math]::Round($amount / 85, 2)
$vat = [math]::Round($amount * 0.075, 2)
$netAmount = $amount - $vat

Write-Host "✅ Token Generated Successfully!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "🎫 TOKEN: $token" -ForegroundColor White
Write-Host "⚡ UNITS: $units kWh" -ForegroundColor Yellow
Write-Host "💰 NET AMOUNT: ₦$netAmount" -ForegroundColor Green
Write-Host "📊 VAT (7.5%): ₦$vat" -ForegroundColor Red
Write-Host "🏢 DISCO: $disco" -ForegroundColor Blue
Write-Host "📅 Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

# Test different amounts
Write-Host "💡 Testing Different Amounts:" -ForegroundColor Cyan
Write-Host "₦1,000 → $([math]::Round(1000 / 85, 2)) kWh"
Write-Host "₦2,000 → $([math]::Round(2000 / 85, 2)) kWh"
Write-Host "₦5,000 → $([math]::Round(5000 / 85, 2)) kWh"
Write-Host "₦10,000 → $([math]::Round(10000 / 85, 2)) kWh"
Write-Host "₦20,000 → $([math]::Round(20000 / 85, 2)) kWh"
Write-Host ""

Write-Host "🏢 Available DISCOs:" -ForegroundColor Cyan
Write-Host "- IKEDC (Ikeja Electric)"
Write-Host "- EKEDC (Eko Electric)" 
Write-Host "- AEDC (Abuja Electric)"
Write-Host "- PHED (Port Harcourt Electric)"
Write-Host "- KEDCO (Kano Electric)"
Write-Host "- KAEDCO (Kaduna Electric)"
Write-Host ""

Write-Host "🎉 PowerPay Token Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 To test the real API:" -ForegroundColor Yellow
Write-Host "1. Start API server: npm run dev:api"
Write-Host "2. Test endpoints: .\test-api.ps1"
Write-Host "3. View docs: http://localhost:3000/api/docs"