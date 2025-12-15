#!/bin/bash

# Opulon Frontend Deployment Script
echo "🚀 Starting Opulon Frontend Deployment..."

# Step 1: Clean and install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Step 2: Run build
echo "🔨 Building application..."
npm run build

# Step 3: Check build success
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Stopping deployment."
    exit 1
fi

# Step 4: Start application
echo "🌟 Starting application..."
npm start

echo "🎉 Deployment completed successfully!"