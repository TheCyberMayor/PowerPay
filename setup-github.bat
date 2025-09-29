@echo off
echo 🚀 PowerPay GitHub Setup Script
echo ===============================

REM Check if git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first:
    echo    https://git-scm.com/downloads
    pause
    exit /b 1
)

echo ✅ Git is installed

REM Check if we're in a git repository
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
) else (
    echo ✅ Git repository already initialized
)

REM Check if there are uncommitted changes
git status --porcelain > temp_status.txt
set /p STATUS= < temp_status.txt
del temp_status.txt

if not "%STATUS%"=="" (
    echo 📝 Adding all files to Git...
    git add .
    
    echo 💾 Committing changes...
    git commit -m "Initial commit: PowerPay electricity payment application" -m "Features:" -m "- NestJS backend API with PostgreSQL and Redis" -m "- React web application and admin dashboard" -m "- React Native mobile app" -m "- Nigerian DISCO integrations" -m "- Payment gateway integrations (Paystack, Flutterwave)" -m "- DigitalOcean deployment configuration" -m "- Comprehensive documentation"
) else (
    echo ✅ No changes to commit
)

REM Check if remote origin exists
git remote | findstr "origin" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Remote origin already configured
    for /f %%i in ('git remote get-url origin') do set REMOTE_URL=%%i
    echo    Remote URL: %REMOTE_URL%
) else (
    echo.
    echo 🔗 GitHub Repository Setup Required
    echo ==================================
    echo.
    echo Please follow these steps:
    echo.
    echo 1. Go to https://github.com and sign in
    echo 2. Click 'New repository' (green button)
    echo 3. Repository name: PowerPay
    echo 4. Description: Nigerian Electricity Payment Application
    echo 5. Set to Private (recommended)
    echo 6. Don't initialize with README
    echo 7. Click 'Create repository'
    echo.
    echo 8. Then run these commands:
    echo    git remote add origin https://github.com/YOUR_USERNAME/PowerPay.git
    echo    git branch -M main
    echo    git push -u origin main
    echo.
    echo Replace YOUR_USERNAME with your actual GitHub username
)

REM Check if main branch exists and is current
for /f %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" (
    echo 🌟 Switching to main branch...
    git branch -M main
)

echo.
echo 📋 Next Steps:
echo ==============
echo.

git remote | findstr "origin" >nul 2>&1
if %errorlevel% equ 0 (
    echo 🚀 Push to GitHub:
    echo    git push origin main
    echo.
    echo 🌊 Deploy to DigitalOcean:
    echo    1. Go to cloud.digitalocean.com
    echo    2. Create → Apps → GitHub
    echo    3. Select your PowerPay repository
    echo    4. Configure environment variables
    echo    5. Deploy!
) else (
    echo 1. Create GitHub repository (see instructions above)
    echo 2. Connect local repository to GitHub
    echo 3. Push code to GitHub
    echo 4. Deploy to DigitalOcean
)

echo.
echo 📚 Documentation:
echo    docs\GITHUB_TO_DIGITALOCEAN.md - Complete deployment guide
echo    docs\DIGITALOCEAN_DEPLOYMENT.md - DigitalOcean specific info
echo.
echo 💡 Need help? Check the documentation or create an issue on GitHub!

pause