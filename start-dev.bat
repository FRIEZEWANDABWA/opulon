@echo off
echo Starting Opulon Development Environment...
echo.

echo Stopping any existing containers...
docker-compose -f docker-compose.dev.yml down

echo.
echo Building and starting services...
docker-compose -f docker-compose.dev.yml up --build

pause