# Everglow Project - Installation Guide

This guide provides step-by-step instructions to set up and run the Everglow booking management system.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Install the following tools before proceeding:

### 1. Node.js & npm
- **Version**: Node.js v18.17.0 or higher (LTS recommended)
- **Download**: [https://nodejs.org/](https://nodejs.org/)
- **Verify Installation**:
  ```bash
  node --version  # Should output v18.17.0 or higher
  npm --version   # Should output 9.6.7 or higher
  ```

### 2. MongoDB
- **Version**: MongoDB v6.0 or higher
- **Download**: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **Alternative**: Use MongoDB Atlas (cloud) - [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Verify Installation**:
  ```bash
  mongod --version  # Should output v6.0 or higher
  ```

### 3. Git
- **Version**: Git v2.40.0 or higher
- **Download**: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **Verify Installation**:
  ```bash
  git --version  # Should output 2.40.0 or higher
  ```

### 4. Code Editor (Recommended)
- **Visual Studio Code**
- **Version**: Latest stable version
- **Download**: [https://code.visualstudio.com/](https://code.visualstudio.com/)

### 5. Postman (Optional - for API testing)
- **Version**: Latest version
- **Download**: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

---

## 🗄️ Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd c:\Users\zhalh\Desktop\webEngProject\everglow\server
```

### Step 2: Install Dependencies
```bash
npm install
```

**Core Backend Dependencies** (automatically installed):
- `express` (v4.18.2) - Web framework
- `mongoose` (v7.5.0) - MongoDB ODM
- `bcryptjs` (v2.4.3) - Password hashing
- `jsonwebtoken` (v9.0.2) - JWT authentication
- `cors` (v2.8.5) - Cross-origin resource sharing
- `dotenv` (v16.3.1) - Environment variables
- `nodemon` (v3.0.1) - Development auto-restart

### Step 3: Set Up MongoDB

**Option A: Local MongoDB**
1. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. Verify MongoDB is running:
   ```bash
   mongosh  # Opens MongoDB shell
   ```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Get connection string from "Connect" → "Connect your application"

### Step 4: Configure Environment Variables
Create a `.env` file in the `server` directory:

```bash
# c:\Users\zhalh\Desktop\webEngProject\everglow\server\.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/everglow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development

# If using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/everglow?retryWrites=true&w=majority
```

### Step 5: Initialize Database (Optional)
If you have seed data:
```bash
npm run seed
```

### Step 6: Verify Backend Setup
```bash
npm run dev
```
Server should start at `http://localhost:5000`

---

## 💻 Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd c:\Users\zhalh\Desktop\webEngProject\everglow\client
```

### Step 2: Install Dependencies
```bash
npm install
```

**Core Frontend Dependencies** (automatically installed):
- `react` (v18.2.0) - UI library
- `react-dom` (v18.2.0) - React DOM renderer
- `react-router-dom` (v6.15.0) - Routing
- `typescript` (v5.1.6) - Type safety
- `vite` (v4.4.9) - Build tool
- `axios` (v1.5.0) - HTTP client
- `@types/react` (v18.2.21) - React type definitions
- `@types/react-dom` (v18.2.7) - React DOM type definitions

### Step 3: Configure Environment Variables
Create a `.env` file in the `client` directory:

```bash
# c:\Users\zhalh\Desktop\webEngProject\everglow\client\.env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Everglow
```

### Step 4: Verify Frontend Setup
```bash
npm run dev
```
Application should start at `http://localhost:5173`

---

## ⚙️ Environment Configuration

### Backend Environment Variables (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/everglow` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Frontend Environment Variables (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `Everglow` |

---

## 🚀 Running the Application

### Development Mode

**Option 1: Run Separately**

Terminal 1 (Backend):
```bash
cd c:\Users\zhalh\Desktop\webEngProject\everglow\server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd c:\Users\zhalh\Desktop\webEngProject\everglow\client
npm run dev
```

**Option 2: Run Concurrently (if configured)**
From root directory:
```bash
npm run dev
```

### Access the Application
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Documentation**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs) (if Swagger is configured)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

#### 2. MongoDB Connection Error
**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
- Verify MongoDB is running: `mongosh`
- Check `MONGODB_URI` in `.env`
- For Windows: `net start MongoDB`

#### 3. Module Not Found
**Error**: `Cannot find module 'package-name'`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors
**Error**: Type errors in React/TypeScript

**Solution**:
```bash
# Reinstall type definitions
npm install --save-dev @types/react @types/react-dom @types/node
```

#### 5. CORS Issues
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Verify backend CORS configuration allows `http://localhost:5173`
- Check `VITE_API_URL` in frontend `.env`

---

## 📦 Production Build

### Backend
```bash
cd server
npm run build  # If TypeScript compilation is configured
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview  # Preview production build
```

Built files will be in `client/dist` directory.

---

## 🔄 Version Control

### Initial Setup
```bash
cd c:\Users\zhalh\Desktop\webEngProject\everglow
git init
git add .
git commit -m "Initial commit"
```

### .gitignore
Ensure these are in your `.gitignore`:
```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
```

---

## 📝 Additional Notes

### Recommended VS Code Extensions
- ESLint (v2.4.2)
- Prettier (v10.1.0)
- TypeScript and JavaScript Language Features
- MongoDB for VS Code
- Thunder Client (API testing)

### Useful Commands

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Clear npm cache (if issues persist)
npm cache clean --force

# Verify installation integrity
npm audit
```

---

## 📞 Support

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages in console
3. Check MongoDB connection status
4. Verify all environment variables are set correctly
5. Ensure all prerequisites are installed with correct versions

---

## ✅ Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB v6+ installed and running
- [ ] Git installed
- [ ] Backend dependencies installed (`server/node_modules`)
- [ ] Frontend dependencies installed (`client/node_modules`)
- [ ] Backend `.env` file created
- [ ] Frontend `.env` file created
- [ ] MongoDB connection verified
- [ ] Backend server running on port 5000
- [ ] Frontend app running on port 5173

**Success!** You're ready to develop with Everglow! 🎉
