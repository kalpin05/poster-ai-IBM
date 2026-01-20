
# 🎨 Poster AI — AI-Powered Poster Generation Platform

*A full-stack web application that allows users to generate posters using text prompts, with optional AI-based prompt enhancement and ML-driven prompt validation.*

---

## 📌 Project Overview

**Poster AI** is a **complete full-stack platform** consisting of:

* A **Frontend** for user interaction
* A **Backend** for orchestration and API handling
* An integrated **ML validation service** that runs automatically with the backend

The system enables users to:

* Generate posters directly using text prompts
* Optionally enhance prompts using an AI chatbot
* Validate prompts using a machine-learning model before image generation
* Generate posters using the Pollinations image generation API

---

## 🧩 System Components

### 🖥️ Frontend (React + Vite)

* User interface for prompt input
* Chatbot interface for prompt enhancement
* “Generate Poster” action
* Poster preview display
* Demo mode and authenticated user mode

---

### 🛠️ Backend (Node.js + Express)

* Handles all API requests from the frontend
* Manages chatbot communication
* Validates prompts using ML service
* Triggers image generation API
* Handles authentication and poster management

> ⚠️ **Important:**
> When the backend server starts, the **ML validation service is automatically started** internally.
> The user does **not** need to start the ML service separately.

---

### 🧠 ML Validation Service (Python)

* Automatically launched with the backend
* Uses **Logistic Regression + TF-IDF**
* Validates whether a user prompt is suitable for poster generation
* Prevents casual or invalid prompts from triggering image generation

**Example:**

* ❌ “Hello, how are you?” → Rejected
* ✅ “Create a poster for organic shampoo” → Accepted

---

## ✨ Key Features

### 🎨 Poster Generation

* Convert text prompts into posters using Pollinations.ai
* One-click poster generation

### 🤖 AI Chatbot Assistance

* Helps users improve prompt quality
* Suggests better wording and structure
* User manually copies enhanced prompt (full user control)

### 🧠 ML-Based Prompt Validation

* Filters non-poster requests
* Improves reliability and user experience
* Reduces unnecessary API calls

### 👥 User Experience

* Clean and responsive UI
* Demo mode without login
* Registered user mode with saved posters
* Simple and transparent workflow

---

## 🚀 Execution Flow

1. Backend server starts (Node.js)

   * ML validation service starts automatically
2. Frontend application starts
3. User interacts with the platform
4. Prompt is validated and poster is generated

---

## 🏗️ Project Architecture

```
new_final/
├── backend/          # Node.js backend (starts ML service internally)
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── index.js
│
├── frontend/         # React + Vite frontend
│   ├── src/
│   └── vite.config.js
│
├── ml/               # ML models & scripts
│   ├── score_service.py
│   ├── reward_model.pkl
│   └── vectorizer.pkl
│
├── package.json
└── README.md
```

---

## 🧠 Machine Learning Details

### Prompt Validation Model

* **Algorithm:** Logistic Regression
* **Features:** TF-IDF Vectorization
* **Purpose:** Identify valid poster-related prompts

### Training Logic

* Prompts rated by quality
* Ratings ≥ 4 → Valid poster request
* Ratings < 4 → Invalid request

---

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication

### AI / ML

* Pollinations.ai (Image generation)
* HuggingFace / Gemini (Chatbot)
* Python (ML validation)
* scikit-learn

---

## 🎯 Academic Relevance

* Demonstrates **full-stack development**
* Applies **machine learning in real-time validation**
* Shows **practical AI integration**
* Suitable for:

  * BTech projects
  * Edunet internship submissions
  * Technical demos and evaluations

---

## 🔮 Future Enhancements

* More advanced prompt-quality models
* Premium image generation APIs
* Style-based poster templates
* Improved chatbot intelligence

---

## ✅ Summary

Poster AI is a **user-controlled, intelligent poster generation platform** that combines:

* Frontend + Backend development
* AI chatbot assistance
* ML-based prompt validation
* Real-time image generation
