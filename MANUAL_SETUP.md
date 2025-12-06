# Manual Setup Guide (Without Docker)

## Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis (optional)

## Backend Setup

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Setup PostgreSQL database:**
```sql
CREATE DATABASE opulon_db;
CREATE USER opulon WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE opulon_db TO opulon;
```

3. **Update environment:**
```bash
# Edit backend/.env
DATABASE_URL=postgresql://opulon:password123@localhost/opulon_db
SECRET_KEY=your-secret-key
DEBUG=True
```

4. **Run database migrations:**
```bash
cd backend
python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

5. **Start backend:**
```bash
cd backend
uvicorn app.main:app --reload
```

## Frontend Setup

1. **Install Node.js dependencies:**
```bash
cd frontend
npm install
```

2. **Update environment:**
```bash
# Edit frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Start frontend:**
```bash
cd frontend
npm run dev
```

## Access Points
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Create Admin User
```bash
# Use the API to create admin user
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@opulon.com",
    "username": "admin",
    "full_name": "Admin User",
    "password": "admin123"
  }'
```

Then manually update the user role in the database to 'superadmin'.