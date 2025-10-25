# Intake Builder - Take Home Assessment

A lightweight, no-code interface for legal operations professionals to define and configure request types for Coheso's generative AI tool.

## 🚀 Live Demo

- **Frontend**: https://coheso-assignment-frontend.vercel.app/
- **Backend API**: https://coheso-assignment-pink.vercel.app/api

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Ant Design + Zustand  
**Backend:** Node.js + Express + TypeScript (ES Modules) + Zod + Vercel

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run build
npm start
# Server runs on http://localhost:3001
```

### Frontend Setup
```bash
cd frontend
npm install

# For local backend (optional)
echo "VITE_API_URL=http://localhost:3001/api" > .env.local

npm run dev
# App runs on http://localhost:5173
```

## 📁 Project Structure

```
interview-assignment/
├── backend/
│   ├── api/              # Vercel serverless entry point
│   ├── src/              # TypeScript source
│   ├── dist/             # Compiled JavaScript
│   └── db.json           # Data storage (local)
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Route pages
│   │   ├── store/        # State management
│   │   └── lib/          # API client
│   └── .env              # Environment variables
├── README.md             # This file
└── thought-process.md    # Development decisions
```

## 🎯 Features

- ✅ Create, edit, delete request types
- ✅ Dynamic field builder (text, long-text, date, select)
- ✅ Search and filter functionality
- ✅ Form validation (client & server)
- ✅ Responsive design (mobile-friendly)
- ✅ Confirmation dialogs for destructive actions

## 🌐 API Endpoints

```
GET    /api/health              # Health check
GET    /api/request-types       # Get all request types
GET    /api/request-types/:id   # Get single request type
POST   /api/request-types       # Create new request type
PUT    /api/request-types/:id   # Update request type
DELETE /api/request-types/:id   # Delete request type
```

Full API documentation: [`backend/API.md`](./backend/API.md)

## 🔧 Environment Variables

**Frontend `.env`:**
```bash
VITE_API_URL=https://coheso-assignment-pink.vercel.app/api
```

**Local Development `.env.local`:**
```bash
VITE_API_URL=http://localhost:3001/api
```

## 🚢 Deployment

Both frontend and backend are deployed on Vercel with:
- ES Module compatibility for modern packages
- Serverless architecture with automatic scaling
- In-memory storage on Vercel (data persists between requests, resets on redeploy)
- CORS configured for cross-origin requests

**Note:** For production, migrate to a persistent database (Postgres, MongoDB, etc.)

## 📝 Key Design Decisions

See [`thought-process.md`](./thought-process.md) for detailed documentation of:
- Planning approach and problem breakdown
- Technology choices and rationale
- Vercel deployment challenges (ES modules, serverless routing, read-only filesystem)
- Trade-offs and assumptions

## 🧪 Testing

**Manual Testing:** https://coheso-assignment-frontend.vercel.app/

**API Testing:** Import Postman collection from `backend/Intake-Builder-API.postman_collection.json`

See [`backend/POSTMAN_TESTING_GUIDE.md`](./backend/POSTMAN_TESTING_GUIDE.md) for details.

## 📦 Build Commands

```bash
# Backend
cd backend
npm run build    # Compile TypeScript

# Frontend
cd frontend
npm run build    # Create production build
npm run preview  # Preview production build
```

## 📄 Documentation

- [`API.md`](./backend/API.md) - Complete API documentation
- [`POSTMAN_TESTING_GUIDE.md`](./backend/POSTMAN_TESTING_GUIDE.md) - API testing guide
- [`thought-process.md`](./thought-process.md) - Development approach and decisions
- [`frontend/README.md`](./frontend/README.md) - Frontend-specific setup

## 🔍 Assumptions

- Single user (no authentication required for MVP)
- In-memory storage acceptable for demo purposes
- Modern browser support (Chrome, Firefox, Safari, Edge)
- Email validation for owner field

---

**Submission Date:** October 25, 2024  
**Assessment:** Coheso Take Home - Intake Builder  
**Live Application:** https://coheso-assignment-frontend.vercel.app/

