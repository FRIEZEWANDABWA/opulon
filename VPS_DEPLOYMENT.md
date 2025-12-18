# VPS Deployment Instructions for opulonhq.com

## 🚀 Quick Deploy Commands

### 1. Connect to VPS
```bash
ssh root@your-vps-ip
```

### 2. Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git
apt install git -y
```

### 3. Clone and Deploy
```bash
# Clone repository
git clone https://github.com/FRIEZEWANDABWA/opulon.git
cd opulon

# Make deployment script executable
chmod +x deploy-production.sh

# Deploy (will use opulonhq.com by default)
./deploy-production.sh
```

### 4. Setup SSL Certificate
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d opulonhq.com -d www.opulonhq.com

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

### 5. Configure Firewall
```bash
# Allow HTTP/HTTPS
ufw allow 80
ufw allow 443
ufw allow 22
ufw --force enable
```

## ✅ Verification Commands

### Check Services
```bash
docker-compose -f docker-compose.production.yml ps
```

### View Logs
```bash
docker-compose -f docker-compose.production.yml logs -f
```

### Test Website
```bash
curl -I https://opulonhq.com
```

## 🔧 Admin Access
- URL: https://opulonhq.com/admin
- Email: afubwa@opulonhq.com
- Password: Afubwa@123

## 📧 Contact
- Email: info@opulonhq.com
- Website: https://opulonhq.com

## 🚨 Troubleshooting
If any issues occur, check logs:
```bash
docker-compose -f docker-compose.production.yml logs backend
docker-compose -f docker-compose.production.yml logs frontend
```