# Opulon E-commerce Platform - VPS Deployment Guide

## ✅ Project Status
- **TypeScript**: No errors
- **Build**: Successful 
- **Images**: Working with proxy
- **Database**: Connected with real data
- **Admin**: Functional with image management
- **Security**: Enhanced with rate limiting, CSRF, JWT

## 🚀 VPS Deployment Steps

### 1. Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- 2GB+ RAM
- 20GB+ storage
- Docker & Docker Compose installed

### 2. Domain Setup
```bash
# Point your domain DNS A record to your VPS IP
# Example: yourdomain.com -> 123.456.789.0
```

### 3. Deploy to VPS
```bash
# Clone repository
git clone <your-repo-url>
cd opilon

# Make deployment script executable
chmod +x deploy-production.sh

# Deploy with your domain
./deploy-production.sh yourdomain.com
```

### 4. SSL Certificate (Let's Encrypt)
```bash
# Install certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 5. Firewall Configuration
```bash
# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 🔧 Configuration Files

### Environment Variables (.env.production)
```env
JWT_SECRET_KEY=your-secure-jwt-key
CSRF_SECRET_KEY=your-secure-csrf-key
DATABASE_URL=postgresql://opulon:devpassword123@db:5432/opulon_db_dev
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### Docker Compose (docker-compose.production.yml)
- Nginx reverse proxy with SSL
- Frontend (Next.js)
- Backend (FastAPI)
- PostgreSQL database

## 📊 Monitoring & Maintenance

### Check Service Status
```bash
docker-compose -f docker-compose.production.yml ps
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker-compose -f docker-compose.production.yml logs -f frontend
```

### Database Backup
```bash
docker-compose -f docker-compose.production.yml exec db pg_dump -U opulon opulon_db_dev > backup.sql
```

### Update Application
```bash
git pull
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d
```

## 🔐 Security Features
- Rate limiting (10 req/s API, 5 req/m login)
- HTTPS redirect
- Security headers (HSTS, XSS protection)
- JWT authentication with 1-hour expiry
- CSRF protection
- Audit logging

## 📱 Access Points
- **Website**: https://yourdomain.com
- **Admin Panel**: https://yourdomain.com/admin
- **API Docs**: https://yourdomain.com/docs

## 👤 Default Admin Credentials
- Email: afubwa@opulonhq.com
- Password: Afubwa@123

## 🚨 Troubleshooting

### Common Issues
1. **Images not loading**: Check image proxy at `/api/image/`
2. **Database connection**: Verify DATABASE_URL in .env.production
3. **SSL issues**: Ensure domain points to server IP
4. **Permission errors**: Check file permissions and Docker access

### Performance Optimization
- Images cached for 1 year
- Gzip compression enabled
- API response caching (30s)
- Static file optimization

## 📈 Recommendations for Production

### Immediate Improvements
1. **Monitoring**: Add Prometheus + Grafana
2. **Logging**: Centralized logging with ELK stack
3. **Backup**: Automated daily database backups
4. **CDN**: CloudFlare for global performance
5. **Email**: SMTP configuration for notifications

### Security Enhancements
1. **WAF**: Web Application Firewall
2. **DDoS Protection**: CloudFlare or similar
3. **Vulnerability Scanning**: Regular security audits
4. **2FA**: Two-factor authentication for admin

### Scalability
1. **Load Balancer**: Multiple backend instances
2. **Database**: Read replicas for scaling
3. **Redis**: Session storage and caching
4. **File Storage**: S3 or similar for images

## 🎯 Next Steps After Deployment
1. Test all functionality on production
2. Set up monitoring and alerts
3. Configure automated backups
4. Implement CI/CD pipeline
5. Add comprehensive error tracking
6. Set up uptime monitoring
7. Configure email notifications
8. Add analytics tracking