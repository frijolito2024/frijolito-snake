# 🌭 Proxy Server - Leaderboard Sync

## Overview

The proxy server handles all GitHub communication. The game client doesn't need any tokens or authentication - it just sends scores to the proxy on `localhost:3000`.

**How it works:**
1. Game saves score locally
2. Game sends POST to `http://127.0.0.1:3000/api/save-score`
3. Proxy receives the score
4. Proxy syncs to GitHub using token from `.env` file
5. Everyone sees updated leaderboard

---

## 🚀 Getting Started

### 1. Create `.env` file with your GitHub token

```bash
cd /tmp/frijolito-snake
cp .env.example .env
```

Edit `.env` and add your GitHub Personal Access Token:
```
GITHUB_TOKEN=ghp_your_token_here
```

**Get a token from:** https://github.com/settings/tokens/new (select `repo` scope only)

### 2. Install dependencies
```bash
npm install
```

### 3. Start the proxy server

**Option A (Recommended - with setup script):**
```bash
chmod +x setup-proxy.sh
./setup-proxy.sh
```

**Option B (Manual):**
```bash
node proxy-server.js
```

Expected output:
```
🌭 Pablo Devorador - Proxy Server
🌭 Running on http://127.0.0.1:3000

POST  /api/save-score   → Save a score to GitHub
GET   /api/scores       → Get all scores

✅ Ready to sync scores!
```

### 4. Play the game

The game will automatically detect the proxy server and sync scores to GitHub.

---

## 📡 API Endpoints

### POST `/api/save-score`

Save a score to the leaderboard.

**Request:**
```bash
curl -X POST http://127.0.0.1:3000/api/save-score \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pablo",
    "score": 850,
    "level": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Score saved",
  "githubSync": true
}
```

---

### GET `/api/scores`

Get all cached scores.

**Request:**
```bash
curl http://127.0.0.1:3000/api/scores
```

**Response:**
```json
{
  "success": true,
  "scores": [
    {
      "name": "Pablo",
      "score": 850,
      "level": 5,
      "date": "2026-01-30T18:39:00.000Z"
    }
  ]
}
```

---

## 🔐 Security

- **Token**: In `.env` file (never in code)
- **Scope**: `repo` (limited to this repository)
- **Communication**: Local HTTP only (same machine)
- **No user tokens needed**: Game doesn't handle any tokens

---

## 🛠️ Troubleshooting

### "Connection refused"
- Make sure the proxy server is running
- Check it's listening on `127.0.0.1:3000`
- Run: `curl http://127.0.0.1:3000/api/scores`

### "GITHUB_TOKEN not found"
- Create `.env` file with your token
- Or run: `export GITHUB_TOKEN=ghp_your_token_here`

### "Failed to update GitHub"
- Check your token is valid
- Make sure it has `repo` scope
- GitHub API might be rate limiting (unlikely)

### Scores not syncing
1. Check if proxy is running: `curl http://127.0.0.1:3000/api/scores`
2. Check browser console for errors (F12)
3. Look at proxy server output for error messages

---

## 📊 How Sync Works

```
Game (Client)
    ↓ POST /api/save-score (no tokens!)
Proxy Server (localhost:3000)
    ↓ Sync to GitHub (token from .env)
GitHub API
    ↓ Update db.json
Your Repo (frijolito2024/frijolito-snake)
    ↓ Everyone sees leaderboard
All Players
```

---

## 🚀 Production Deployment

For public deployment:

1. Move to a real server (Heroku, Railway, AWS, etc.)
2. Update game client to point to the new URL
3. Use environment variables for the GitHub token
4. Add rate limiting
5. Add logging/monitoring

For now, this is local-only and works great for testing!

---

**Created by:** Frijolito 🫘
**Purpose:** Zero-friction leaderboard sync, tokens never exposed to client
**Status:** ✅ Ready to use
