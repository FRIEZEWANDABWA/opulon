# Opulon - Modern Healthcare E-commerce Platform

🏥 **Next-generation pharmaceutical and medical supply e-commerce platform**

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with dark/light mode
- **Secure Authentication**: JWT-based auth with role management
- **AI-Powered**: Intelligent chatbot and product recommendations
- **Payment Integration**: Stripe, PayPal, and Flutterwave support
- **Admin Dashboard**: Complete product and order management
- **Mobile-First**: Optimized for all devices

## 🛠 Tech Stack

### Backend
- **FastAPI** - High-performance Python API framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **Celery** - Background tasks

### Frontend
- **Next.js 15** - React framework with App Router
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Zustand** - State management
- **React Query** - Data fetching

## 📁 Project Structure

```
opilon/
├── backend/           # FastAPI backend
├── frontend/          # Next.js frontend
├── infra/            # Docker & deployment
└── README.md
```

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Live Demo
- **Frontend**: https://opulonhq.com
- **API Docs**: https://api.opulonhq.com/docs

---
Built with ❤️ for better healthcare accessibility