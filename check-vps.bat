@echo off
echo Checking VPS status...
echo.

echo 1. Testing main site:
curl -I https://opulonhq.com

echo.
echo 2. Testing backend API:
curl -I https://opulonhq.com/api/v1/health

echo.
echo 3. Testing backend direct:
curl -I https://opulonhq.com:8000/health

pause