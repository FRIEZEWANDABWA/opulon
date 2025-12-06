# Opulon Docker Setup & Testing Guide

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git (optional, for cloning)

### 1. Development Environment (Recommended for testing)
```bash
# Start development environment with hot reloading
docker-compose -f docker-compose.dev.yml up --build

# Or use the batch script on Windows
start-dev.bat
```

### 2. Production Environment
```bash
# Start production environment
docker-compose up --build -d

# Or use the batch script on Windows
start-prod.bat
```

## 🔗 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main Opulon website |
| Backend API | http://localhost:8000 | FastAPI backend |
| API Documentation | http://localhost:8000/docs | Interactive API docs |
| Database | localhost:5432 | PostgreSQL database |
| Redis | localhost:6379 | Redis cache |
| Nginx Proxy | http://localhost:80 | Production proxy |

## 👤 Test Accounts

### Admin Account
- **Email**: admin@opulon.com
- **Password**: admin123
- **Role**: superadmin

### Test User Account
Create via registration or use API to create test users.

## 🧪 Testing Checklist

### ✅ Backend Tests
1. Visit http://localhost:8000/docs
2. Test `/health` endpoint
3. Test authentication endpoints
4. Test product CRUD operations
5. Test cart functionality

### ✅ Frontend Tests
1. Visit http://localhost:3000
2. Test user registration
3. Test user login
4. Browse products catalog
5. Add items to cart
6. Test admin dashboard (login as admin)

### ✅ Full E-commerce Flow
1. **Register** new user account
2. **Browse** products catalog
3. **Search** for specific products
4. **Add** items to cart
5. **View** cart and update quantities
6. **Admin Login** and manage products
7. **Test** order creation flow

## 🛠 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using ports
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :5432
```

**Database connection issues:**
```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

**Frontend not loading:**
```bash
# Check frontend logs
docker logs opulon_frontend_dev
```

**Backend API errors:**
```bash
# Check backend logs
docker logs opulon_backend_dev
```

### Reset Everything
```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove all images
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Database Access
```bash
# Connect to PostgreSQL
docker exec -it opulon_db_dev psql -U opulon -d opulon_dev

# View tables
\dt

# View users
SELECT * FROM users;

# View products
SELECT * FROM products;
```

## 🎯 Success Criteria

Your Opulon setup is working correctly when:

1. ✅ Frontend loads at http://localhost:3000
2. ✅ API docs accessible at http://localhost:8000/docs
3. ✅ User can register and login
4. ✅ Products display in catalog
5. ✅ Cart functionality works
6. ✅ Admin can login and manage products
7. ✅ Database contains sample data
8. ✅ All services show healthy status

## 🚀 Next Steps

Once testing is complete:
1. Deploy to cloud provider (AWS, GCP, Azure)
2. Set up CI/CD pipeline
3. Configure production database
4. Set up monitoring and logging
5. Configure SSL certificates
6. Set up backup strategies