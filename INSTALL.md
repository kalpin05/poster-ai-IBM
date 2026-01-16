# Installation Guide

## Quick Install (from parent folder)

Run this single command from the project root to install all dependencies for both backend and frontend:

```bash
npm run install-all
```

## Manual Install

### Backend (Node.js)

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

### Backend Dependencies
- express@5.2.1
- cors@2.8.5
- dotenv@17.2.3
- morgan@1.10.1
- pg@8.16.3
- pg-hstore@2.3.4
- sequelize@6.37.7
- bcrypt@6.0.0
- jsonwebtoken@9.0.3
- multer@2.0.2
- node-fetch@2.7.0
- nodemon@3.1.11 (dev)

## Frontend (React Vite)

Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

### Frontend Dependencies
- react@19.2.0
- react-dom@19.2.0
- react-router-dom@7.12.0
- vite@7.2.5 (dev)
- @vitejs/plugin-react@5.1.1 (dev)
- eslint@9.39.1 (dev)
- @eslint/js@9.39.1 (dev)
- eslint-plugin-react-hooks@7.0.1 (dev)
- eslint-plugin-react-refresh@0.4.24 (dev)
- globals@16.5.0 (dev)
- @types/react@19.2.5 (dev)
- @types/react-dom@19.2.3 (dev)

## Running the Project

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:5173`.
