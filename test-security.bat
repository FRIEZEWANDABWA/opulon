@echo off
echo 🔒 Running Security Tests on Test Environment
echo =============================================

echo 📋 Checking if test environment is running...
curl -s http://localhost:8001/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Test environment not running!
    echo 🚀 Start it first with: test-launch.bat
    pause
    exit /b 1
)

echo ✅ Test environment is running

echo 🔧 Populating test data...
python test-populate.py

echo 🛡️  Running security tests...
cd backend\security_upgrade
python run_all_tests.py

echo 📊 Security test complete!
echo =============================================
echo 🌐 Test your website: http://localhost:3001
echo 🔑 Login with: test.admin@opulon.test / TestAdmin123!
echo =============================================

pause