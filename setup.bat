@echo off
echo 🚀 Setting up PowerPay Development Environment...

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Check if Docker is installed
where docker >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker is installed
    set DOCKER_AVAILABLE=true
) else (
    echo ⚠️  Docker is not installed. You'll need to set up PostgreSQL and Redis manually.
    set DOCKER_AVAILABLE=false
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your configuration.
) else (
    echo ✅ .env file already exists
)

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install API dependencies
echo 📦 Installing API dependencies...
cd apps\api
call npm install
cd ..\..

REM Install Web dependencies
echo 📦 Installing Web dependencies...
cd apps\web
call npm install
cd ..\..

REM Install Admin dependencies
echo 📦 Installing Admin dependencies...
cd apps\admin
call npm install
cd ..\..

REM Install Mobile dependencies
echo 📦 Installing Mobile dependencies...
cd apps\mobile
call npm install
cd ..\..

REM Install Shared library dependencies
echo 📦 Installing Shared library dependencies...
cd libs\shared
call npm install
cd ..\..

REM Start Docker services if available
if "%DOCKER_AVAILABLE%"=="true" (
    echo 🐳 Starting Docker services...
    docker-compose -f docker-compose.dev.yml up -d
    
    echo ⏳ Waiting for PostgreSQL to be ready...
    timeout /t 10
    
    echo 🗄️  Running database migrations...
    cd apps\api
    call npm run migrate
    cd ..\..
    
    echo ✅ Database migrations completed
) else (
    echo ⚠️  Please set up PostgreSQL and Redis manually:
    echo    - PostgreSQL: Create database 'powerpay_dev'
    echo    - Redis: Start Redis server on port 6379
    echo    - Run 'npm run migrate' in apps/api after setup
)

echo.
echo 🎉 PowerPay setup completed!
echo.
echo 📋 Next steps:
echo    1. Update your .env file with API keys and configuration
echo    2. Start the development servers:
echo       npm run dev
echo.
echo 🌐 Application URLs:
echo    - API Server: http://localhost:3000
echo    - Web App: http://localhost:3001
echo    - Admin Dashboard: http://localhost:3002
echo    - API Documentation: http://localhost:3000/api/docs
echo.
if "%DOCKER_AVAILABLE%"=="true" (
    echo 🛠️  Database Management:
    echo    - PgAdmin: http://localhost:5050 (admin@powerpay.ng / admin123)
    echo    - Redis Commander: http://localhost:8081
    echo.
)
echo 📚 For more information, see docs\DEVELOPMENT.md

pause