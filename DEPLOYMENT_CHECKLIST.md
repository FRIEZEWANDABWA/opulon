# Opulon Deployment Checklist

## Pre-Deployment Security & Configuration

### ✅ Security Enhancements
- [x] Added security headers in Next.js config
- [x] Implemented middleware for CORS and security
- [x] Added error boundaries for better error handling
- [x] Removed console logs in production
- [x] Added request timeouts and proper error handling
- [x] Implemented proper token management

### ✅ Performance Optimizations
- [x] Image optimization enabled
- [x] Compression enabled
- [x] CSS optimization
- [x] Package import optimization
- [x] Cache headers configured

### ✅ Mobile Responsiveness
- [x] Responsive navbar with hamburger menu
- [x] Mobile-optimized cards and layouts
- [x] Touch-friendly buttons and interactions
- [x] Proper viewport meta tag
- [x] Mobile-first design approach

## VPS Deployment Steps

### 1. Environment Configuration
```bash
# On VPS, create .env.production file:
NEXT_PUBLIC_API_URL=https://opulonhq.com
NODE_ENV=production
```

### 2. Backend API Endpoints Check
Ensure these endpoints are working on VPS:
- `GET /api/v1/health` - Health check
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/products/` - Products list
- `GET /api/v1/products/categories/` - Categories

### 3. CORS Configuration
Backend must allow:
- Origin: `https://opulonhq.com`
- Methods: `GET, POST, PUT, DELETE, OPTIONS`
- Headers: `Content-Type, Authorization`

### 4. SSL Certificate
- Ensure SSL is properly configured
- Redirect HTTP to HTTPS
- Update API_URL to use HTTPS

### 5. Database Connection
- Verify database is accessible
- Check connection strings
- Ensure migrations are applied

## Common VPS Issues & Solutions

### Issue 1: Backend Not Accessible
**Solution:**
```bash
# Check if backend is running
sudo systemctl status your-backend-service

# Check firewall
sudo ufw status
sudo ufw allow 8000  # If backend runs on port 8000

# Check nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

### Issue 2: Products Not Loading
**Causes:**
- CORS not configured properly
- Database connection issues
- API endpoints not matching

**Solution:**
1. Check browser console for CORS errors
2. Verify API endpoints are accessible
3. Check database connection

### Issue 3: Login/Registration Issues
**Causes:**
- Token storage issues
- API endpoint mismatch
- CORS problems

**Solution:**
1. Clear browser localStorage
2. Check API endpoints
3. Verify CORS headers

## Build & Deploy Commands

### Frontend Build
```bash
cd frontend
npm install
npm run build
npm start
```

### Environment Variables
```bash
# Production environment
export NEXT_PUBLIC_API_URL=https://opulonhq.com
export NODE_ENV=production
```

## Testing Checklist

### ✅ Functionality Tests
- [ ] Homepage loads correctly
- [ ] Products page shows products
- [ ] Login/registration works
- [ ] Cart functionality works
- [ ] Mobile navigation works
- [ ] All links work properly
- [ ] Images load correctly
- [ ] Background photos visible

### ✅ Security Tests
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] No open ports except necessary ones
- [ ] Error messages don't reveal sensitive info

### ✅ Performance Tests
- [ ] Page load times < 3 seconds
- [ ] Images optimized
- [ ] Mobile performance good
- [ ] No console errors

## Post-Deployment Monitoring

### Health Checks
- Monitor API response times
- Check error rates
- Monitor server resources
- Verify SSL certificate validity

### Backup Strategy
- Database backups
- Code repository backups
- Image assets backups
- Configuration backups