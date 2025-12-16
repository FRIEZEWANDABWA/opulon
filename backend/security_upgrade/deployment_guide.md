# Production Deployment Guide - Opulon Healthcare Platform

## 🚀 **DEPLOYMENT OVERVIEW**

This guide provides step-by-step instructions for deploying the enhanced Opulon platform with production-grade security.

### **Architecture**
```
Internet → NGINX (SSL/Rate Limiting) → FastAPI (Cookie Auth/RBAC) → PostgreSQL/Redis
```

### **Domain Structure**
- `opulonhq.com` → User Frontend (Next.js)
- `admin.opulonhq.com` → Admin Frontend (Next.js)
- `api.opulonhq.com` → Backend API (FastAPI)

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **1. VPS Requirements**
- **OS**: Ubuntu 22.04 LTS
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 50GB SSD minimum
- **CPU**: 2 cores minimum
- **Network**: Public IP with ports 80, 443, 22 open

### **2. Domain Setup**
Configure DNS A records:
```
opulonhq.com        → YOUR_VPS_IP
www.opulonhq.com    → YOUR_VPS_IP
api.opulonhq.com    → YOUR_VPS_IP
admin.opulonhq.com  → YOUR_VPS_IP
```

### **3. Generate Secrets**
```bash
# Generate strong secrets (run locally)
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
python3 -c "import secrets; print('CSRF_SECRET_KEY=' + secrets.token_urlsafe(32))"
python3 -c "import secrets; print('DB_PASSWORD=' + secrets.token_urlsafe(16))"
python3 -c "import secrets; print('REDIS_PASSWORD=' + secrets.token_urlsafe(16))"
```

---

## 🔧 **VPS SETUP**

### **Step 1: Initial Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git ufw fail2ban htop

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Configure fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### **Step 2: Install Docker & Docker Compose**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login to apply group changes
exit
```

### **Step 3: Clone and Setup Project**
```bash
# Clone repository
git clone https://github.com/FRIEZEWANDABWA/opulon.git
cd opulon

# Create production environment file
cat > .env.production << EOF
# Database
DB_PASSWORD=YOUR_GENERATED_DB_PASSWORD

# Security Keys
JWT_SECRET_KEY=YOUR_GENERATED_JWT_SECRET
CSRF_SECRET_KEY=YOUR_GENERATED_CSRF_SECRET

# Redis
REDIS_PASSWORD=YOUR_GENERATED_REDIS_PASSWORD

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
EOF

# Secure environment file
chmod 600 .env.production
```

### **Step 4: Database Migration**
```bash
# Apply database schema upgrades
docker-compose -f docker-compose.production.yml up -d postgres redis
sleep 30

# Run database migrations
docker exec -i opulon_postgres psql -U opulon_prod -d opulon_prod < security_upgrade/schema.sql

# Initialize admin users and products
docker-compose -f docker-compose.production.yml exec api python init_admin.py
docker-compose -f docker-compose.production.yml exec api python init_products.py
```

### **Step 5: SSL Certificate Setup**
```bash
# Start NGINX for Let's Encrypt challenge
docker-compose -f docker-compose.production.yml up -d nginx

# Obtain SSL certificates
docker-compose -f docker-compose.production.yml run --rm certbot

# Restart NGINX with SSL
docker-compose -f docker-compose.production.yml restart nginx
```

### **Step 6: Full Deployment**
```bash
# Deploy all services
docker-compose -f docker-compose.production.yml up -d

# Verify all services are running
docker-compose -f docker-compose.production.yml ps

# Check logs
docker-compose -f docker-compose.production.yml logs -f
```

---

## 🔒 **SECURITY HARDENING**

### **1. System Security**
```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Configure automatic security updates
sudo apt install -y unattended-upgrades
echo 'Unattended-Upgrade::Automatic-Reboot "false";' | sudo tee -a /etc/apt/apt.conf.d/50unattended-upgrades

# Setup log monitoring
sudo apt install -y logwatch
echo "logwatch --output mail --mailto admin@opulonhq.com --detail high" | sudo tee -a /etc/cron.daily/logwatch
```

### **2. Docker Security**
```bash
# Enable Docker content trust
echo 'export DOCKER_CONTENT_TRUST=1' >> ~/.bashrc

# Setup log rotation for Docker
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

sudo systemctl restart docker
```

### **3. Database Security**
```bash
# Backup script
cat > /home/deploy/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
docker exec opulon_postgres pg_dump -U opulon_prod opulon_prod | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /home/deploy/backup.sh

# Schedule daily backups
echo "0 2 * * * /home/deploy/backup.sh" | crontab -
```

---

## 🔄 **MAINTENANCE & UPDATES**

### **Update Application**
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d

# Run any new migrations
docker-compose -f docker-compose.production.yml exec api alembic upgrade head
```

### **SSL Certificate Renewal**
```bash
# Setup automatic renewal
echo "0 12 * * * /usr/local/bin/docker-compose -f /home/deploy/opulon/docker-compose.production.yml run --rm certbot renew --quiet && /usr/local/bin/docker-compose -f /home/deploy/opulon/docker-compose.production.yml restart nginx" | crontab -
```

### **Monitoring Commands**
```bash
# Check service health
docker-compose -f docker-compose.production.yml ps
docker-compose -f docker-compose.production.yml logs api --tail 50

# Monitor resources
docker stats

# Check SSL certificate expiry
echo | openssl s_client -servername opulonhq.com -connect opulonhq.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

1. **SSL Certificate Issues**
```bash
# Check certificate status
docker-compose -f docker-compose.production.yml logs certbot

# Manual certificate renewal
docker-compose -f docker-compose.production.yml run --rm certbot renew --force-renewal
```

2. **Database Connection Issues**
```bash
# Check database logs
docker-compose -f docker-compose.production.yml logs postgres

# Test database connection
docker-compose -f docker-compose.production.yml exec postgres psql -U opulon_prod -d opulon_prod -c "SELECT version();"
```

3. **API Not Responding**
```bash
# Check API logs
docker-compose -f docker-compose.production.yml logs api

# Restart API service
docker-compose -f docker-compose.production.yml restart api
```

### **Emergency Procedures**

1. **Rollback Deployment**
```bash
# Revert to previous version
git checkout HEAD~1
docker-compose -f docker-compose.production.yml up -d --force-recreate
```

2. **Database Recovery**
```bash
# Restore from backup
gunzip -c /home/deploy/backups/db_backup_YYYYMMDD_HHMMSS.sql.gz | docker exec -i opulon_postgres psql -U opulon_prod -d opulon_prod
```

---

## ✅ **POST-DEPLOYMENT VERIFICATION**

### **1. Test All Endpoints**
```bash
# Health checks
curl -I https://api.opulonhq.com/health
curl -I https://opulonhq.com/
curl -I https://admin.opulonhq.com/

# Test authentication
curl -X POST https://api.opulonhq.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123!"}'
```

### **2. Security Verification**
```bash
# SSL rating check
curl -s "https://api.ssllabs.com/api/v3/analyze?host=opulonhq.com" | jq '.status'

# Security headers check
curl -I https://opulonhq.com/ | grep -E "(X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security)"
```

### **3. Performance Testing**
```bash
# Load testing (install apache2-utils)
sudo apt install -y apache2-utils
ab -n 100 -c 10 https://api.opulonhq.com/health
```

---

## 📞 **SUPPORT & MONITORING**

### **Log Locations**
- **NGINX**: `/var/log/nginx/`
- **API**: `docker-compose logs api`
- **Database**: `docker-compose logs postgres`
- **Redis**: `docker-compose logs redis`

### **Key Metrics to Monitor**
- Response times < 200ms
- Error rate < 1%
- Database connections < 80% of max
- Memory usage < 80%
- Disk usage < 85%

### **Alerting Setup**
Consider implementing monitoring with:
- **Uptime monitoring**: UptimeRobot (free)
- **Log monitoring**: ELK stack or Grafana
- **Performance**: New Relic or DataDog

---

**🎉 DEPLOYMENT COMPLETE!**

Your Opulon healthcare platform is now running with production-grade security:
- ✅ Cookie-based JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ 2FA for admin users
- ✅ Rate limiting and CSRF protection
- ✅ SSL/TLS encryption
- ✅ Audit logging
- ✅ Automated backups