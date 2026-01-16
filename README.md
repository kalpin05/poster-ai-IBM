# Poster Generator with AI

A full‑stack web application that generates custom posters using AI‑powered image generation (Pollinations.ai).  
The project includes a backend, frontend, and a Python‑based ML service for chatbot assistance and prompt ranking.  
Teachers or evaluators can test the project without logging in.

---

# Features

- 🎨 Generate posters from text prompts  
- 🖼️ AI image generation via Pollinations.ai  
- 💬 **AI Chatbot** (Gemma/Gemini) for improved prompt suggestions  
- 🧠 **ML Service (Python)** for prompt ranking + chatbot support  
- 👥 Clean, modern UI  
- 🔓 Public demo mode (no login required)  
- 💾 Session‑based storage for guests  
- 🔐 Persistent storage for logged‑in users (PostgreSQL)  
- 📦 Modular architecture (Backend + Frontend + ML)

---

## **🚀 Quick Start**

### **1. Install all dependencies**
From the **root folder**:

```bash
npm run install-all
```

### **2. Start backend & frontend**
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

### **3. Start the ML Service (Required for Chatbot + Prompt Ranking)**

```bash
cd ml
# install python dependencies
pip install -r requirements.txt

# run the ML microservice
python run_ranker.py --input_path prompt_scores.jsonl --out_dir prompt_ranker
```

### **4. Open the app**
- Frontend → http://localhost:5173  
- Backend API → http://localhost:5000  

> ⚠️ **Note:**  
> The ML service must be running for the chatbot and prompt‑ranking features to work.  
> Poster generation still works without it, but prompt quality will be lower.

---

## **📁 Project Structure**

```
new_final/
├── backend/               # Node.js/Express API
│   ├── routes/            # API endpoints
│   ├── models/            # Sequelize models
│   └── .env               # Backend environment variables
│
├── frontend/              # React + Vite frontend
│   └── src/
│       ├── pages/         # UI pages
│       └── services/      # API client
│
├── ml/                    # Python ML service
│   ├── run_ranker.py      # ML microservice (chatbot + prompt ranking)
│   ├── prompt_scores.jsonl# Training data
│   ├── requirements.txt   # Python dependencies
│   └── ...                # Other ML utilities
│
└── package.json           # Root scripts
```

---

## **🔧 Environment Setup**

### **Backend `.env`**

```env
# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASS=admin
DB_NAME=posterdb
PORT=5000

# JWT
JWT_SECRET=your-secret-key

# AI Services
HF_API_BASE_URL=https://router.huggingface.co/v1
HF_MODEL=google/gemma-3-27b-it:nebius
HF_API_KEY=your-hf-key
GEMINI_API_KEY=your-gemini-key
```

### **Frontend `.env`**

```env
VITE_API_URL=http://localhost:5000
```

### **ML Service Environment**

```env
HF_API_KEY=your-hf-key
```

---

## **🧠 ML Service (Chatbot + Prompt Ranking)**

The `ml/` folder contains Python scripts that power:

### ✔ Chatbot prompt refinement  
The chatbot uses Gemma/Gemini + embeddings to suggest better prompts.

### ✔ Prompt ranking  
Before generating an image, multiple candidate prompts are scored using:

- HuggingFace embeddings  
- Logistic regression classifier  
- Human feedback dataset (`prompt_scores.jsonl`)

This improves image quality and reduces failed Pollinations calls.

### ✔ Required to run  
You **must** start the ML service:

```bash
cd ml
python score_service.py

---

## **🖥️ Usage**

### **Demo Mode (No Login)**

- Visit `/dashboard`
- Enter a prompt → poster appears instantly
- Posters disappear on refresh (session only)

### **Logged‑In Mode**

- Sign up / log in
- Posters are saved to PostgreSQL
- Persistent across sessions

### **Chatbot**

- Helps users craft better prompts  
- Suggests variations  
- Integrates with the ML ranker  
- Improves poster quality

---

## **📡 API Endpoints**

### Posters
- `GET /posters` – List posters  
- `POST /posters` – Create poster  
- `DELETE /posters/:id` – Delete poster  

### Auth
- `POST /auth/login`  
- `POST /auth/signup`  

### Chatbot
- `POST /chatbot/chat` – AI prompt assistant  

---

## **🛠️ Tech Stack**

### Frontend
- React 19  
- Vite  
- React Router  

### Backend
- Node.js  
- Express  
- Sequelize ORM  
- PostgreSQL  

### AI / ML
- Pollinations.ai (image generation)  
- HuggingFace (Gemma)  
- Gemini API  
- Python (scikit‑learn, joblib)  

### Auth
- JWT  
- bcrypt  

---

## **☁️ Deployment Notes (Render)**

- Deploy backend as a Render Web Service  
- Deploy PostgreSQL using Render Managed PostgreSQL  
- Set all `.env` variables in Render dashboard  
- ML service can also be deployed as a separate Render service  
- Update `VITE_API_URL` in frontend for production

---

## **🤝 Contributing**

1. Fork the repo  
2. Create a feature branch  
3. Make changes  
4. Test backend + frontend + ML  
5. Submit PR  



