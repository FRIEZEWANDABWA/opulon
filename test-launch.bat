@echo off
echo 🚀 Launching Opulon in Safe Testing Environment
echo ================================================

echo 📋 Pre-launch checks...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker not found! Please install Docker Desktop
    pause
    exit /b 1
)

echo ✅ Docker found

echo 🧹 Cleaning up any existing test containers...
docker-compose -f docker-compose.test.yml down -v 2>nul

echo 🔧 Building and starting test environment...
docker-compose -f docker-compose.test.yml up --build -d

echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

echo 📊 Checking service status...
docker-compose -f docker-compose.test.yml ps

echo 🌐 Testing URLs:
echo   Frontend: http://localhost:3001
echo   Backend:  http://localhost:8001
echo   API Docs: http://localhost:8001/docs

echo 🔍 Running quick health check...
timeout /t 5 /nobreak >nul
curl -s http://localhost:8001/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend not ready yet, checking logs...
    docker-compose -f docker-compose.test.yml logs test_backend --tail=10
) else (
    echo ✅ Backend is healthy
)

echo 📝 Test Environment Ready!
echo ================================================
echo 🔗 Open in browser: http://localhost:3001
echo 📚 API Documentation: http://localhost:8001/docs
echo 🛠️  View logs: docker-compose -f docker-compose.test.yml logs -f
echo 🛑 Stop testing: docker-compose -f docker-compose.test.yml down
echo ================================================

pause