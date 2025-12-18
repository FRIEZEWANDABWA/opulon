#!/bin/bash

# Production deployment script for VPS
set -e

echo "🚀 Starting production deployment..."

# Use opulonhq.com as default domain
DOMAIN=${1:-opulonhq.com}

echo "📝 Configuring for domain: $DOMAIN"

echo "📝 Using domain: $DOMAIN"

# Generate secure secrets if not provided
if [ -z "$JWT_SECRET_KEY" ]; then
    export JWT_SECRET_KEY=$(openssl rand -base64 32)
    echo "🔐 Generated JWT secret"
fi

if [ -z "$CSRF_SECRET_KEY" ]; then
    export CSRF_SECRET_KEY=$(openssl rand -base64 32)
    echo "🔐 Generated CSRF secret"
fi

# Update secrets in .env.production
sed -i "s/your-super-secure-jwt-secret-key-here-change-this/$JWT_SECRET_KEY/g" .env.production
sed -i "s/your-super-secure-csrf-secret-key-here-change-this/$CSRF_SECRET_KEY/g" .env.production

echo "🏗️  Building production images..."
docker-compose -f docker-compose.production.yml build

echo "🗄️  Setting up database..."
docker-compose -f docker-compose.production.yml up -d db
sleep 10

echo "🚀 Starting all services..."
docker-compose -f docker-compose.production.yml up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "👤 Creating admin user..."
docker-compose -f docker-compose.production.yml exec backend python init_admin.py

echo "📦 Initializing products..."
docker-compose -f docker-compose.production.yml exec backend python init_products.py

echo "✅ Deployment complete!"
echo "🌐 Your website should be available at: https://$DOMAIN"
echo "🔧 Admin panel: https://$DOMAIN/admin"
echo "📊 API docs: https://$DOMAIN/docs"

echo ""
echo "📋 Next steps:"
echo "1. Point your domain DNS to this server's IP"
echo "2. Set up SSL certificate (Let's Encrypt recommended)"
echo "3. Configure firewall to allow ports 80 and 443"
echo "4. Monitor logs: docker-compose -f docker-compose.production.yml logs -f"