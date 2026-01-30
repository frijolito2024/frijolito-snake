# 🏆 Global Leaderboard API

## Overview

Pablo el Devorador de Huevos ahora tiene un sistema de leaderboard global que persiste scores en una base de datos JSON.

**Arquitectura:**
- **Frontend:** Juego en el navegador (almacena en localStorage también)
- **Backend:** Node.js HTTP server (api-server.js)
- **Database:** JSON file (db.json)

---

## 🚀 Getting Started

### 1. Instalar dependencias
```bash
cd /tmp/frijolito-snake
npm install
```

### 2. Iniciar el servidor API
```bash
node api-server.js
```

Expected output:
```
🌭 Leaderboard API Server running on http://127.0.0.1:3000
GET  /api/leaderboard       - Get top 50 scores
GET  /api/leaderboard/top10 - Get top 10 scores
POST /api/leaderboard       - Save new score
GET  /api/leaderboard/stats - Get global stats
```

### 3. Juega normalmente
- El juego guarda scores localmente en localStorage
- Si el servidor API está corriendo, también guarda en la DB global
- Si el servidor no está disponible, funciona sin problemas (solo local)

---

## 📡 API Endpoints

### GET `/api/leaderboard`

Obtiene los top 50 scores ordenados por puntuación.

**Request:**
```bash
curl http://127.0.0.1:3000/api/leaderboard
```

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "name": "Pablo",
      "score": 850,
      "level": 5,
      "date": "2026-01-30T18:19:00.000Z",
      "rank": 1
    },
    {
      "name": "Juan",
      "score": 630,
      "level": 3,
      "date": "2026-01-30T17:25:00.000Z",
      "rank": 2
    }
  ]
}
```

---

### GET `/api/leaderboard/top10`

Obtiene solo los top 10 scores.

**Request:**
```bash
curl http://127.0.0.1:3000/api/leaderboard/top10
```

**Response:** (same format as `/api/leaderboard` but max 10 entries)

---

### POST `/api/leaderboard`

Guarda un nuevo score a la base de datos global.

**Request:**
```bash
curl -X POST http://127.0.0.1:3000/api/leaderboard \
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
  "message": "Score saved"
}
```

---

### GET `/api/leaderboard/stats`

Obtiene estadísticas globales del leaderboard.

**Request:**
```bash
curl http://127.0.0.1:3000/api/leaderboard/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalScores": 42,
    "uniquePlayers": 8,
    "highestScore": 1200,
    "averageScore": 580,
    "lastUpdated": "2026-01-30T18:19:00.000Z"
  }
}
```

---

## 🎮 Integration with Game

El juego automáticamente:

1. **Guarda en localStorage:**
   - Funciona sin conexión
   - Persiste entre sesiones
   - Local al navegador

2. **Intenta guardar en API global:**
   - Si `http://127.0.0.1:3000` está disponible
   - Si no está disponible, continúa funcionando normalmente
   - Sin impacto en la experiencia del usuario

**Código en game.js:**
```javascript
function saveToGlobalLeaderboard(entry) {
    fetch('http://127.0.0.1:3000/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    })
    .then(res => console.log('✅ Score saved to global DB'))
    .catch(err => console.log('⚠️ Global DB unavailable'));
}
```

---

## 📁 Database Format

**File:** `db.json`

```json
{
  "leaderboard": [
    {
      "name": "Pablo",
      "score": 850,
      "level": 5,
      "date": "2026-01-30T18:19:00.000Z"
    }
  ],
  "version": "1.0.0",
  "lastUpdated": "2026-01-30T18:19:00.000Z"
}
```

---

## 🛠️ Development

### Running locally with live reload
```bash
npm install -g nodemon
nodemon api-server.js
```

### Testing the API
```bash
# Test saving a score
curl -X POST http://127.0.0.1:3000/api/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","score":999,"level":6}'

# Get leaderboard
curl http://127.0.0.1:3000/api/leaderboard | jq

# Get stats
curl http://127.0.0.1:3000/api/leaderboard/stats | jq
```

---

## 🚀 Deployment

Para producción:

1. **Opción A: Keep API local**
   - Corre `api-server.js` en tu servidor Linux
   - El juego se conecta a `http://[server-ip]:3000`

2. **Opción B: Deploy to cloud**
   - Usa Vercel, Heroku, Railway, etc.
   - Actualiza la URL en game.js

---

## ✅ Checklist

- [x] API Server implementado
- [x] Database JSON file
- [x] Game integración
- [x] CORS habilitado
- [x] Error handling
- [x] Local fallback
- [ ] Web dashboard para ver stats
- [ ] Sincronización en tiempo real

---

**Creado por:** Frijolito 🫘
**Fecha:** 2026-01-30
