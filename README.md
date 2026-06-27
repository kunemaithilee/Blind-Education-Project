# EchoLearn - Voice-First Education Platform for the Blind & Visually Impaired

A **voice-first educational web application** purpose-built for **blind and visually impaired students**. Navigate the app, consume lessons, take quizzes, ask AI questions, and read text from images — entirely through voice.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v6, CSS |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB + Mongoose 8 (with in-memory demo fallback) |
| **Authentication** | JWT + bcrypt |
| **AI / NLP** | OpenAI API (GPT-4o-mini) with local fallback |
| **OCR** | Tesseract.js |
| **Speech** | Web Speech API (SpeechSynthesis + SpeechRecognition) |
| **File Uploads** | Multer |
| **Deployment** | Vercel (serverless) |

## Features

- **Voice-First Navigation** — Global voice assistant (Alt+V) controls every page
- **AI Learning Assistant** — Ask questions via voice, powered by GPT-4o-mini
- **Audio-First Course Library** — Search & filter courses, each with audio-readable lessons
- **Lesson Player** — Text-to-speech lesson reader
- **Sound-Based Quizzes** — Spoken questions and options with instant feedback
- **OCR** — Upload images to extract and read text aloud
- **Progress Tracking** — Dashboard with stats, streaks, and activity timeline
- **Audio Notes** — Save and listen to summaries
- **Accessibility Settings** — Font size, speech speed, high contrast, screen reader mode
- **Resilient Architecture** — Works with or without a database (demo data fallback)

## Quick Start

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Configure environment
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# (Optional) Seed database
npm run setup-db
npm run seed

# Run development servers
npm run dev
```

The app runs at `http://localhost:3000` with the backend at `http://localhost:5000`.

**Demo credentials:** `alex@example.com` / `password123`

## Environment Variables

| File | Key | Description |
|------|-----|-------------|
| `backend/.env` | `MONGO_URI` | MongoDB connection string |
| `backend/.env` | `JWT_SECRET` | Secret key for JWT tokens |
| `frontend/.env` | `REACT_APP_API_URL` | Backend API URL (default: `http://localhost:5000`) |

## Deployment

This project includes a `vercel.json` for serverless deployment on Vercel. The API is served as a serverless function at `/api/*`.

## License

MIT
