@echo off
echo Starting Opulon Production Environment...
echo.

echo Stopping any existing containers...
docker-compose down

echo.
echo Building and starting services...
docker-compose up --build -d

echo.
echo Services started! Access points:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Nginx Proxy: http://localhost:80
echo.

pause