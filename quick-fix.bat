@echo off
echo Updating production deployment with fixed environment variables...

echo Copying environment files to VPS...
scp backend\.env.prod deploy@82.197.92.25:/home/deploy/opulon/backend/.env.prod
scp frontend\.env.prod deploy@82.197.92.25:/home/deploy/opulon/frontend/.env.prod

echo Restarting containers on VPS...
ssh deploy@82.197.92.25 "cd /home/deploy/opulon && docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d --build"

echo Deployment updated!
pause