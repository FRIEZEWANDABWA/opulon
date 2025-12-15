# 🚀 Opulon Perfect Deployment Guide

## Pre-Deployment Checklist ✅

### 1. Local Testing
```bash
cd C:\websites\opilon\frontend
npm run check  # Lint and build check
npm run dev    # Test locally one final time
```

### 2. Environment Files Ready
- ✅ `.env.local` (for local development)
- ✅ `.env.production` (for VPS production)
- ✅ `.env.example` (for reference)

## 🎯 Step-by-Step Deployment

### Step 1: Prepare Repository
```bash
# Navigate to project root
cd C:\websites\opilon

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Production-ready Opulon website with security enhancements"

# Add remote repository
git remote add origin https://github.com/yourusername/opulon.git

# Push to GitHub
git push -u origin main
```

### Step 2: VPS Backend Setup
```bash
# On your VPS, ensure backend is running
sudo systemctl status your-backend-service

# Check if API endpoints are accessible
curl https://opulonhq.com/api/v1/health
curl https://opulonhq.com/api/v1/products/
```

### Step 3: VPS Frontend Deployment
```bash
# On VPS, clone repository
git clone https://github.com/yourusername/opulon.git
cd opulon/frontend

# Create production environment file
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://opulonhq.com
NODE_ENV=production
EOF

# Install dependencies
npm ci --production=false

# Build application
npm run build

# Start application (use PM2 for production)
npm install -g pm2
pm2 start npm --name "opulon-frontend" -- start
pm2 save
pm2 startup
```

### Step 4: Nginx Configuration
```nginx
# /etc/nginx/sites-available/opulon
server {
    listen 80;
    server_name opulonhq.com www.opulonhq.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name opulonhq.com www.opulonhq.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://opulonhq.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    }
}
```

## 🔧 Troubleshooting Common Issues

### Issue 1: Products Not Loading
**Check:**
```bash
# Test API directly
curl https://opulonhq.com/api/v1/products/

# Check browser console for CORS errors
# Verify backend is running on port 8000
```

### Issue 2: Login Not Working
**Check:**
```bash
# Test login endpoint
curl -X POST https://opulonhq.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Clear browser localStorage
# Check network tab for failed requests
```

### Issue 3: Images Not Loading
**Check:**
```bash
# Verify images are in public/images/
ls frontend/public/images/

# Check image paths in browser network tab
# Ensure proper file extensions (.png, .jpg, .jpeg, .webp)
```

## 🎯 Final Verification Steps

### 1. Frontend Health Check
```bash
# Check if frontend is running
curl https://opulonhq.com

# Check specific pages
curl https://opulonhq.com/products
curl https://opulonhq.com/about
```

### 2. Backend Health Check
```bash
# API health check
curl https://opulonhq.com/api/v1/health

# Test authentication
curl https://opulonhq.com/api/v1/auth/login

# Test products
curl https://opulonhq.com/api/v1/products/
```

### 3. Mobile Testing
- Open website on mobile device
- Test navigation menu
- Test all pages and functionality
- Verify images load properly

## 🚨 Emergency Rollback Plan

If something goes wrong:
```bash
# Stop current deployment
pm2 stop opulon-frontend

# Rollback to previous version
git checkout HEAD~1

# Rebuild and restart
npm run build
pm2 restart opulon-frontend
```

## 📞 Support Commands

### View Logs
```bash
# Frontend logs
pm2 logs opulon-frontend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart Services
```bash
# Restart frontend
pm2 restart opulon-frontend

# Restart nginx
sudo systemctl restart nginx

# Restart backend (adjust service name)
sudo systemctl restart your-backend-service
```

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Website loads at https://opulonhq.com
- ✅ All pages are accessible
- ✅ Products load correctly
- ✅ Login/registration works
- ✅ Mobile navigation works
- ✅ Background images are visible
- ✅ No console errors
- ✅ SSL certificate is valid

## 🎉 Post-Deployment

After successful deployment:
1. Test all functionality thoroughly
2. Monitor logs for any errors
3. Set up monitoring/alerts
4. Create backup schedule
5. Document any custom configurations