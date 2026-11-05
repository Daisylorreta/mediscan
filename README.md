# MediScan

React + Vite client (root) and a Node/Express API (`server/`).

## Setup
Terminal 1 - API
    cd server
    cp .env.example .env     # set JWT_SECRET and ANTHROPIC_API_KEY
    npm install
    npm run dev              # http://localhost:3001

Terminal 2 - client
    npm install
    npm run dev              # http://localhost:5173  (proxies /api to :3001)

## Demo mode (no API key needed)
Leave ANTHROPIC_API_KEY blank in server/.env (or set DEMO_MODE=true) and the AI chat and photo scan
return fixed sample answers, clearly labelled as demo. Everything else works normally.
Add a real key later and restart the server to switch to the real AI.

## What the API does
POST /api/auth/signup | /login, GET /api/auth/me   email + password, bcrypt, JWT (7 days)
GET/POST /api/medications, DELETE /api/medications/:id
POST /api/medications/scan   photo -> Claude vision -> name/dosage/frequency/prescriber
POST /api/chat               AI doctor; the user's uploaded medications are added to the system prompt
GET  /api/chat/consultations

## Notes
- The Anthropic key lives only in server/.env. Never put it in the React code.
- Data is stored in server/data/db.json so it runs with zero setup. Swap server/db.js for a real
  database (Postgres, MongoDB, Supabase) before real users; the routes only use its small interface.
- Scanned values are suggestions: the user reviews and edits them before saving.
- Add HTTPS, stricter CORS, and a privacy policy before handling real patient data.
