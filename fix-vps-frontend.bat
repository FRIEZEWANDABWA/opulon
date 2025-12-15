@echo off
echo Fixing VPS frontend API connection...

echo Updating VPS frontend environment...
ssh root@82.197.92.25 "cd /home/deploy/opulon && docker exec opulon_frontend sh -c 'echo \"NEXT_PUBLIC_API_URL=https://opulonhq.com\" > /app/.env.local'"

echo Restarting frontend to pick up changes...
ssh root@82.197.92.25 "cd /home/deploy/opulon && docker restart opulon_frontend"

echo Waiting for frontend to start...
timeout /t 15

echo Testing the fix...
ssh root@82.197.92.25 "curl -I https://opulonhq.com"

echo Frontend fix complete!
pause