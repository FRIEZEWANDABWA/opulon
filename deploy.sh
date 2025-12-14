#!/bin/bash

# Production Deployment Script for Opulon Healthcare Platform
# Run this script on your Hostinger VPS

set -e

echo "🚀 Starting Opulon Production Deployment..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Create application directory
echo "📁 Setting up application directory..."
mkdir -p /opt/opulon
cd /opt/opulon

# Clone repository (if not already present)
if [ ! -d ".git" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/FRIEZEWANDABWA/opulon.git .
fi

# Generate secure secrets
echo "🔐 Generating secure secrets..."
DB_PASSWORD=$(openssl rand -base64 32)
SECRET_KEY=$(openssl rand -base64 64)

# Create production environment file
cat > .env << EOF
# Production Environment Variables
DB_PASSWORD=${DB_PASSWORD}
SECRET_KEY=${SECRET_KEY}
DOMAIN=yourdomain.com
EOF

# Update production environment files
sed -i "s/CHANGE_THIS_DB_PASSWORD/${DB_PASSWORD}/g" backend/.env.prod
sed -i "s/CHANGE_THIS_TO_SECURE_RANDOM_KEY_IN_PRODUCTION/${SECRET_KEY}/g" backend/.env.prod

# Set up SSL directory
echo "🔒 Setting up SSL directory..."
mkdir -p nginx/ssl

# Generate self-signed certificate (replace with real certificate)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=yourdomain.com"

echo "⚠️  IMPORTANT: Replace the self-signed certificate with a real SSL certificate!"

# Set proper permissions
chown -R root:root /opt/opulon
chmod 600 nginx/ssl/key.pem
chmod 644 nginx/ssl/cert.pem

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 30

# Create admin users
echo "👤 Creating admin users..."
docker-compose -f docker-compose.prod.yml exec -T backend python create_admin_users.py

# Set up firewall
echo "🔥 Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 Opulon Healthcare Platform is now running!"
echo "📍 Access your application at: https://yourdomain.com"
echo ""
echo "👥 Admin Accounts Created:"
echo "   Super Admin: friezekw@gmail.com / Hakunapassword@123"
echo "   Admin: afubwa@opulonhq.com / Afubwa@123"
echo ""
echo "🔧 Next Steps:"
echo "1. Update DNS to point yourdomain.com to this server's IP"
echo "2. Replace self-signed SSL certificate with real certificate"
echo "3. Update CORS settings in backend/.env.prod"
echo "4. Configure email settings for notifications"
echo ""
echo "📊 Monitor logs with: docker-compose -f docker-compose.prod.yml logs -f"