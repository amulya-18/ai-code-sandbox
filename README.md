# 🧠 AI Code Sandbox

> An AI-powered code editor in your browser — write smarter, code faster.

**Live Demo →** [ai-code-sandbox.vercel.app](https://ai-code-sandbox.vercel.app)

-----

## What is this?

AI Code Sandbox is a full-stack web application that brings AI-assisted code generation directly into a browser-based code editor. Powered by **LLaMA 70B** via the **Groq API**, it lets you describe what you want to build and get production-ready code in seconds — all inside a VS Code-quality editor.

-----

## ✨ Features

- 🤖 **AI Code Generation** — Describe your problem, get working code using LLaMA 70B (Groq)
- 🖊️ **Monaco Editor** — The same editor that powers VS Code, embedded in the browser
- 🔐 **JWT Authentication** — Secure login/signup with token-based auth
- 🗄️ **MongoDB Atlas** — Cloud database for user account management
- ⚡ **Fast Inference** — Groq’s LPU hardware makes AI responses near-instant

-----

## 🛠️ Tech Stack

|Layer     |Technology                          |
|----------|------------------------------------|
|Frontend  |React.js, Monaco Editor             |
|Backend   |Node.js, Express.js                 |
|Database  |MongoDB Atlas                       |
|AI        |Groq API (LLaMA 70B)                |
|Auth      |JWT (JSON Web Tokens) + bcrypt      |
|Deployment|Vercel (frontend) + Render (backend)|

-----

## 🏗️ Architecture

```
User (Browser)
      │
      ▼
React Frontend ──────────────── Vercel
      │
      │  REST API calls
      ▼
Express Backend ─────────────── Render
      │              │
      ▼              ▼
MongoDB Atlas     Groq API
(user data)    (LLaMA 70B inference)
```

The frontend and backend are fully decoupled. The backend acts as a secure proxy for the Groq API — keeping the API key server-side and never exposing it to the client.

-----

## 🚀 Run Locally

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier works)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo

```bash
git clone https://github.com/amulya-18/ai-code-sandbox.git
cd ai-code-sandbox
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Start the server:

```bash
npm start
```

### 3. Setup the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the React app:

```bash
npm start
```

The app will be running at `http://localhost:3000`

-----

## 🔐 How Authentication Works

1. User registers/logs in via the frontend form
1. Backend validates credentials against MongoDB (passwords hashed with bcrypt)
1. Server returns a signed JWT token
1. Frontend stores the token and sends it in the `Authorization` header for all API calls
1. Protected routes verify the token via middleware before responding

-----

## 🤖 How AI Generation Works

1. User types a prompt in the editor (e.g. “write a binary search in Python”)
1. Frontend sends the prompt to `/api/ai/generate` on the Express backend
1. Backend forwards the prompt to Groq API with LLaMA 70B as the model
1. Groq returns the AI-generated code
1. Backend sends it to the frontend, where it’s rendered in Monaco Editor

-----

## 📁 Project Structure

```
ai-code-sandbox/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages (Login, Editor, etc.)
│   │   └── App.js          # Root component + routing
│   └── package.json
│
└── server/                 # Express backend
    ├── routes/             # API route handlers
    ├── middleware/         # JWT auth middleware
    ├── models/             # MongoDB schemas (User, etc.)
    ├── index.js            # Entry point
    └── package.json
```

-----

## 🌐 Deployment

|Service |Platform     |Auto-deploy        |
|--------|-------------|-------------------|
|Frontend|Vercel       |✅ On push to `main`|
|Backend |Render       |✅ On push to `main`|
|Database|MongoDB Atlas|☁️ Always-on cloud  |


> **Note:** Environment variables (API keys, DB URI) are configured in the Vercel and Render dashboards — never committed to the repo.

-----

## 🔮 Planned Features

- [ ] Save and manage code snippets
- [ ] Multi-language support (Python, C++, JavaScript, Java)
- [ ] AI code explainer mode
- [ ] Share code snippets via public URL
- [ ] Usage rate limiting per user

-----

## 👨‍💻 Author

**Amulya** — B.Tech ECE, NIT Hamirpur  
[GitHub](https://github.com/amulya-18) · [LinkedIn](https://www.linkedin.com/in/amulya-singla-26201628b?utm_source=share_via&utm_content=profile&utm_medium=member_ios)

-----

## 📄 License

MIT License — feel free to fork and build on this.