# 🫘 Frijolito Snake - El Mejor Juego del Mundo

Un juego de Snake moderno, responsive y completamente funcional en navegador. 

## 🎮 Características Actuales (v1.2)

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
- Nivel 1: Come 5 manzanas, subes a Nivel 2
- En Nivel 2: Come 7 manzanas, subes a Nivel 3
- ¡Sigue avanzando y demuestra tu destreza!

**Ver Progreso:** El contador en la pantalla muestra tu progreso (ej: "2 (3/7)" = Nivel 2, 3 de 7 comidas para nivel siguiente)

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

**Hecho por:** Frijolito 🫘
**Última actualización:** 2026-01-30
**Versión:** 1.0.0
