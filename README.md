# 🏥 Opulon - Modern Healthcare E-commerce Platform

A comprehensive healthcare distribution platform providing pharmaceutical products, medical supplies, and healthcare technology solutions.

## 🚀 Features

- **Modern UI/UX** with healthcare-themed backgrounds
- **Mobile-responsive** design with touch-friendly navigation
- **Secure authentication** with JWT tokens
- **Product catalog** with search and filtering
- **Shopping cart** and order management
- **Admin dashboard** for product and user management
- **Dark/Light mode** support
- **Enterprise-grade security** headers and CORS protection

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **FastAPI** - Python web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **SQLAlchemy** - ORM

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm 8+
- Python 3.8+
- PostgreSQL

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables
```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development

# .env.production (production)
NEXT_PUBLIC_API_URL=https://opulonhq.com
NODE_ENV=production
```

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy
```bash
# Build and start
npm run build
npm start

# Or use PM2 for production
pm2 start npm --name "opulon-frontend" -- start
```

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-optimized interactions
- Mobile navigation menu
- Optimized images and performance

## 🔒 Security Features

- Security headers (XSS, CSRF, Clickjacking protection)
- CORS configuration
- Input validation and sanitization
- Secure token management
- HTTPS enforcement

## 🎨 Design System

- Healthcare-themed color palette
- Professional typography
- Consistent spacing and layouts
- Accessible design patterns
- Dark/Light mode compatibility

## 📊 Performance

- Image optimization
- Code splitting
- CSS optimization
- Compression enabled
- Caching strategies

## 🧪 Testing

```bash
# Lint code
npm run lint

# Build check
npm run build

# Full check
npm run check
```

## 📄 License

Private - All rights reserved

## 🤝 Support

For support and questions, contact the development team.

---

Built with ❤️ for modern healthcare distribution