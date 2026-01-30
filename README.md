# 🌭 Pablo el Devorador de Huevos 🍳

Una versión épica, responsiva y completamente funcional del clásico juego Snake.

**Inspirado en:** La insaciable pasión de Pablo por las salchichas y los huevos fritos 🤤

Controla a Pablo (sí, LA salchicha) mientras devora huevos fritos en su camino hacia la gloria gaming. Porque si Pablo puede devorar comida real, ¿por qué no en un videojuego? 

## 🎮 Características Actuales (v1.8)

- ✅ Juego completamente funcional
- ✅ Responsive design (PC, Tablet, Móvil)
- ✅ Controles con teclado (Flechas) + Swipe gestures
- ✅ D-pad móvil mejorado (75x75px para mejor UX)
- ✅ **Sistema de niveles con progresión clara** (6 niveles: Easy → Nightmare)
- ✅ Cada nivel requiere más comidas para avanzar
- ✅ Velocidad aumenta progresivamente por nivel
- ✅ Puntuación con multiplicador por nivel (10 + level*5 puntos)
- ✅ Progress visual dentro del juego (1/5 foods eaten)
- ✅ High score guardado en localStorage
- ✅ Pausa/Reanuda con indicador visual
- ✅ Colisión contra paredes y contra sí mismo
- ✅ Interfaz moderna y animada con gradientes
- ✅ Generación aleatoria de comida
- ✅ Smart cache-busting con Service Worker
- ✅ **NUEVO:** Leaderboard global en GitHub (sin servidor)
- ✅ **NUEVO:** Sincronización automática de scores
- ✅ **NUEVO:** Personalización de nombre de jugador
- ✅ **NUEVO:** Top 50 scores con medallas (🥇🥈🥉)
- ✅ **NUEVO:** Almacenamiento local + GitHub backup

## 🎯 Próximas Mejoras (Roadmap)

### Semana 1
- [ ] Efectos de sonido
- [ ] Animaciones mejoradas
- [ ] Power-ups (escudo, velocidad, puntos dobles)
- [ ] Modo Endless
- [ ] Modos de juego (Classic, Time Attack, Survival)

### Semana 2
- [ ] Leaderboard online
- [ ] Temas visuales (Dark, Light, Neon, Retro)
- [ ] Estadísticas detalladas
- [ ] Achievements/Badges
- [ ] Exportar récords

### Semana 3+
- [ ] Multijugador local (2 snakes)
- [ ] Mapas con obstáculos
- [ ] Skins personalizables
- [ ] Tutorial interactivo
- [ ] Optimizaciones de rendimiento

## 🎮 Cómo Jugar

1. Presiona "Start Game"
2. Usa las **flechas del teclado** o **desliza el dedo** para mover
3. Come las **manzanas rojas** 🍎
4. ¡Evita chocar con las paredes y contigo mismo!

## 📊 Sistema de Niveles

Cada nivel es más difícil y requiere más comidas para avanzar:

| Nivel | Nombre | Comidas | Velocidad | Puntos/Comida |
|-------|--------|---------|-----------|---------------|
| 1 | Easy | 5 | 100ms | 15 pts |
| 2 | Normal | 7 | 85ms | 20 pts |
| 3 | Hard | 8 | 70ms | 25 pts |
| 4 | Extreme | 10 | 55ms | 30 pts |
| 5 | Insane | 12 | 40ms | 35 pts |
| 6 | Nightmare | 15 | 30ms | 40 pts |

**Ejemplo:** 
- Nivel 1: Come 5 huevos fritos, subes a Nivel 2
- En Nivel 2: Come 7 huevos fritos, subes a Nivel 3
- ¡Sigue avanzando y demuestra tu destreza de salchicha hambrienta!

**Ver Progreso:** El contador en la pantalla muestra tu progreso (ej: "2 (3/7)" = Nivel 2, 3 de 7 comidas para nivel siguiente)

## 🏆 Leaderboard Global (GitHub-Powered)

¡Compite con el mundo! El juego guarda scores **directamente en GitHub**, sin servidor.

**Arquitectura:**
- 🎮 **Juego:** GitHub Pages (estático)
- 💾 **Database:** `db.json` en el repo
- 🔐 **Auth:** GitHub Personal Access Token (opcional)
- ☁️ **Sync:** Automático al terminar cada partida

### Setup (5 minutos)

1. **En el Juego:**
   - Click en **"🏆 Leaderboard"**
   - Expande **"🔐 Sincronización Global"**
   - Copia tu GitHub Token aquí

2. **Generar Token:**
   - Ve a: https://github.com/settings/tokens/new
   - Scopes: `repo` (SOLO eso)
   - Generate → Copy token

3. **Listo:**
   - Tus scores se sincronizan automáticamente
   - Todos ven el mismo leaderboard global

### Características

✅ **Sin servidor:** Todo en GitHub, sin costos
✅ **Automático:** Sincroniza al terminar partida
✅ **Offline:** Funciona sin conexión (sincroniza después)
✅ **Histórico:** Todos los scores guardados
✅ **Colaborativo:** Leaderboard global compartido

### Ver Global Leaderboard

- **En el juego:** Click "🏆 Leaderboard"
- **En GitHub:** https://github.com/frijolito2024/frijolito-snake/blob/master/db.json

### Más Info

Lee [GITHUB_INTEGRATION.md](./GITHUB_INTEGRATION.md) para detalles técnicos.

## 🛠️ Tecnologías

- HTML5 Canvas para renderizado
- CSS3 Grid y Flexbox responsive
- Vanilla JavaScript (sin dependencias)
- LocalStorage para persistencia

## 📱 Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Android Chrome
- ✅ iOS Safari
- ✅ Tablets (iPad, Samsung Tab, etc)

## 🚀 Deploy

El juego está deployado en GitHub Pages y listo para jugar.

---

## 🎉 Easter Egg / Tribute

Este juego está dedicado a **Pablo** 🌭, amigo del grupo que tiene una afinidad comprobada por:
- Salchichas (obviamente, es la protagonista)
- Huevos fritos (la comida a devorar)
- Gameplay épico (porque Pablo es épico)

*"Vas a clonar mis nalgas" - Pablo, 2026*

---

**Hecho por:** Frijolito 🫘
**Inspirado por:** Juan (la idea maestra de tema) + Pablo (el meme)
**Última actualización:** 2026-01-30
**Versión:** 1.4.0
