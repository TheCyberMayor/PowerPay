# PowerPay API Test Script
# Test token generation and other API endpoints

echo "🔌 PowerPay API Testing Suite"
echo "=============================="

# API Base URL
$API_BASE = "http://localhost:3000"

# Test if API server is running
echo ""
echo "🔍 Checking if API server is running..."
try {
    $health = Invoke-RestMethod -Uri "$API_BASE/health" -Method GET -TimeoutSec 5
    echo "✅ API Server is running!"
    echo "Health check result: $health"
} catch {
    echo "❌ API Server is not running. Please start it first:"
    echo "   cd apps\api"
    echo "   npm run start:dev"
    echo ""
    echo "Or run: npm run dev:api from project root"
    exit 1
}

echo ""
echo "🎫 Testing Token Generation Endpoints"
echo "====================================="

# Test 1: Generate Prepaid Token
echo ""
echo "🔋 Test 1: Generate Prepaid Token"
echo "--------------------------------"

$tokenRequest = @{
    meterNumber = "12345678901"
    disco = "IKEDC"
    amount = 5000
    customerName = "Test Customer"
    customerPhone = "+2348012345678"
    customerEmail = "test@example.com"
} | ConvertTo-Json

try {
    $tokenResponse = Invoke-RestMethod -Uri "$API_BASE/api/tokens/generate" -Method POST -Body $tokenRequest -ContentType "application/json"
    echo "✅ Token generated successfully!"
    echo "Token: $($tokenResponse.token)"
    echo "Units: $($tokenResponse.units) kWh"
    echo "Amount: ₦$($tokenResponse.amount)"
} catch {
    echo "❌ Token generation failed: $($_.Exception.Message)"
}

# Test 2: Validate Meter Number
echo ""
echo "🔍 Test 2: Validate Meter Number"
echo "-------------------------------"

try {
    $meterValidation = Invoke-RestMethod -Uri "$API_BASE/api/meters/validate/12345678901?disco=IKEDC" -Method GET
    echo "✅ Meter validation successful!"
    echo "Customer: $($meterValidation.customerName)"
    echo "Address: $($meterValidation.address)"
    echo "Tariff: $($meterValidation.tariff)"
} catch {
    echo "❌ Meter validation failed: $($_.Exception.Message)"
}

# Test 3: Check Postpaid Bill
echo ""
echo "💳 Test 3: Check Postpaid Bill"
echo "-----------------------------"

try {
    $billCheck = Invoke-RestMethod -Uri "$API_BASE/api/bills/check/98765432109?disco=EKEDC" -Method GET
    echo "✅ Bill check successful!"
    echo "Outstanding: ₦$($billCheck.outstandingAmount)"
    echo "Due Date: $($billCheck.dueDate)"
} catch {
    echo "❌ Bill check failed: $($_.Exception.Message)"
}

# Test 4: Payment History
echo ""
echo "📊 Test 4: Get Payment History"
echo "-----------------------------"

try {
    $payments = Invoke-RestMethod -Uri "$API_BASE/api/payments/history?limit=5" -Method GET
    echo "✅ Payment history retrieved!"
    echo "Total payments: $($payments.length)"
    if ($payments.length -gt 0) {
        echo "Latest payment: ₦$($payments[0].amount) on $($payments[0].createdAt)"
    }
} catch {
    echo "❌ Payment history failed: $($_.Exception.Message)"
}

# Test 5: DISCO List
echo ""
echo "🏢 Test 5: Get DISCO Information"
echo "-------------------------------"

try {
    $discos = Invoke-RestMethod -Uri "$API_BASE/api/discos" -Method GET
    echo "✅ DISCO list retrieved!"
    echo "Available DISCOs:"
    foreach ($disco in $discos) {
        echo "  - $($disco.name) ($($disco.code))"
    }
} catch {
    echo "❌ DISCO list failed: $($_.Exception.Message)"
}

echo ""
echo "🎉 API Testing Complete!"
echo "========================"
echo ""
echo "💡 To test with your own data:"
echo "   - Change meter numbers in this script"
echo "   - Update customer information"
echo "   - Test with different DISCOs"
echo ""
echo "📚 API Documentation available at: $API_BASE/api/docs"