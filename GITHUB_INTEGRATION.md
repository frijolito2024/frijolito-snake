# 🔗 GitHub Integration - Global Leaderboard

## Overview

Pablo el Devorador de Huevos ahora guarda scores directamente en el repositorio de GitHub. **Sin servidor, sin API, todo en GitHub.**

---

## 🚀 Cómo Funciona

### Flujo:
1. Juegas una partida
2. Al terminar, el score se guarda **localmente** (localStorage)
3. Si configuraste un GitHub Token, se **sincroniza automáticamente**
4. El archivo `db.json` del repo se actualiza
5. Todos los jugadores ven el leaderboard global

### Storage:
- **Local:** `localStorage` (funciona offline)
- **Global:** `db.json` en GitHub (sincronizado)

---

## 🔐 Setup (5 minutos)

### Paso 1: Crear un GitHub Personal Access Token

1. Ve a: https://github.com/settings/tokens/new
2. Dale un nombre: `pablo-devorador-token` (o lo que quieras)
3. Selecciona **SOLO el scope `repo`** (no hagas checks extra)
4. Click en "Generate token"
5. **Copia el token** (no lo podrás ver después)

⚠️ **CUIDADO:** Este token es como tu contraseña. No lo compartas ni lo publiques.

### Paso 2: Configurar en el Juego

1. Abre el juego: https://frijolito2024.github.io/frijolito-snake/
2. Click en **"🏆 Leaderboard"**
3. Expande: **"🔐 Sincronización Global (Opcional)"**
4. Pega tu token en el campo
5. Click en **"Guardar Token"**

¡Listo! Ahora tus scores se guardarán automáticamente en GitHub.

---

## 📝 Qué Sucede

### Cuando Juegas + Terminas:

```
Game Over
  ↓
Guardado Local ✅ (localStorage)
  ↓
¿Hay Token GitHub? 
  ├─ SI → Actualiza db.json en GitHub ✅
  └─ NO → Solo local (sin problema)
  ↓
Leaderboard Actualizado
```

### En GitHub:

Cada score genera un commit automático con el mensaje:
```
🌭 New score: Pablo (850 pts, Lvl 5)
```

El archivo `db.json` se actualiza con:
- Nombre del jugador
- Puntuación
- Nivel alcanzado
- Timestamp

---

## 🎮 Características

✅ **Automático:** No tienes que hacer nada después de guardar el token
✅ **Seguro:** Token guardado en navegador (localStorage), no enviado a terceros
✅ **Offline:** Funciona sin conexión (se sincroniza después)
✅ **Histórico:** Todos los scores quedan guardados
✅ **Colaborativo:** Todos los jugadores ven el mismo leaderboard

---

## 🔍 Ver el Leaderboard Global

### Opción A: En el Juego
1. Click en **"🏆 Leaderboard"**
2. Verás los top 50 scores de GitHub

### Opción B: En GitHub Directamente
- Repo: https://github.com/frijolito2024/frijolito-snake
- Archivo: `db.json`
- Ver el contenido JSON directamente

---

## ⚙️ Cómo Funciona Técnicamente

### Game.js:
```javascript
async function saveToGitHubDB(entry) {
    // 1. Fetch db.json actual
    // 2. Parsea el contenido (base64)
    // 3. Agrega nuevo score
    // 4. Ordena por score (DESC)
    // 5. Limita a top 100
    // 6. Hace PUT a GitHub API
    // 7. GitHub actualiza el archivo
}
```

### GitHub API:
```
PUT /repos/{owner}/{repo}/contents/db.json
Headers:
  Authorization: token {TOKEN}
  Content-Type: application/json

Body:
  {
    message: "🌭 New score: ...",
    content: base64(db.json),
    sha: {current_sha}
  }
```

---

## 🚨 Troubleshooting

### "Error saving to GitHub"

**Posibles causas:**
1. Token expirado → Genera uno nuevo
2. Token inválido → Verifica que sea correcto
3. Scope insuficiente → Necesita `repo`
4. Rate limiting → GitHub limita 60 requests/hour (unlikely)

**Solución:**
```javascript
// Abre console (F12)
localStorage.removeItem('githubToken');
// Vuelve a ingresar el token
```

### "No veo mis scores en el leaderboard"

**Posibles causas:**
1. No guardaste el token
2. Token no tiene permisos
3. db.json no existe en el repo

**Solución:**
- Verifica que el token esté guardado
- Revisa que tengas acceso al repo
- Usa el botón "🏆 Leaderboard" para recargar

---

## 🔒 Seguridad

### ¿Es seguro poner mi token en el juego?

**Sí, porque:**
1. Se guarda **localmente** en `localStorage`
2. **NO** se envía a servidores terceros
3. **NO** se guarda en cookies o datos públicos
4. Solo se usa para escribir en `db.json` (tu repo)

### ¿Puedo revocar el token después?

**Sí:**
1. Ve a https://github.com/settings/tokens
2. Click en el token
3. Click en "Delete"
4. También: `localStorage.removeItem('githubToken')`

---

## 📈 Estadísticas

El archivo `db.json` contiene:

```json
{
  "leaderboard": [
    {
      "name": "Pablo",
      "score": 850,
      "level": 5,
      "date": "2026-01-30T18:24:00.000Z"
    }
  ],
  "version": "1.0.0",
  "lastUpdated": "2026-01-30T18:24:00.000Z"
}
```

Puedes ver:
- **Total Scores:** Cuántos scores se han guardado
- **Unique Players:** Cuántas personas han jugado
- **High Score:** Mejor puntuación de todos
- **Average:** Promedio de scores

---

## 🎯 Próximos Pasos

1. ✅ Juega varias partidas
2. ✅ Configura tu token GitHub
3. ✅ Mira tu nombre en el leaderboard global
4. ✅ Comparte el juego con amigos
5. ✅ Usa el botón "🏆 Leaderboard" para ver rankings

---

**Creado por:** Frijolito 🫘
**Sistema:** GitHub-native leaderboard
**Token Location:** localStorage (local only)
**Sync:** Automático al terminar cada partida
