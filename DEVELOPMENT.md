# 🛠️ Guía de Desarrollo

## Cache Busting & Auto-Updates

### Problema
GitHub Pages cachea agresivamente los archivos. Los cambios no se ven sin limpiar la caché o usar incógnito.

### Solución Implementada

#### 1. **Meta Tags de No-Cache**
El `index.html` incluye meta tags que dicen al navegador no cachear:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

#### 2. **Query Parameter Versioning**
Los archivos CSS y JS usan versioning:
```html
<link rel="stylesheet" href="style.css?v=1.1">
<script src="game.js?v=1.1"></script>
```

Cuando hay cambios, el número de versión incrementa y el navegador descarga el archivo nuevo.

#### 3. **Service Worker**
`sw.js` maneja el cacheo inteligentemente:
- **Network-First Strategy**: Intenta traer de la red primero
- **Fallback a Cache**: Si no hay red, usa la versión cacheada
- **Auto-update**: Busca actualizaciones cada hora

#### 4. **Auto-Version Script**
Ejecuta `./bump-version.sh` antes de hacer commit para auto-incrementar la versión.

### Cómo Usarlo

**Opción A: Manual (Recomendado)**
```bash
# Hacer cambios
# ...

# Incrementar versión
./bump-version.sh

# Commit y push
git add .
git commit -m "Feature: ..."
git push
```

**Opción B: Siempre en Incógnito**
Los usuarios pueden abrir en modo incógnito para ver los cambios inmediatamente.

### Test

Después de hacer push:
1. Abre en Incógnito para ver cambios inmediatos
2. Abre en pestaña normal
3. Los cambios deberían aparecer en minutos (gracias al Service Worker)

---

## Workflow

```
Local Dev → Commit → Push → GitHub Pages Deploy → CDN Cache → Users
```

El Service Worker maneja los últimos 30 minutos de transición del cache.
