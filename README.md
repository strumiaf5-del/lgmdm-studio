# LGMDM Studio

**LGMDM** = La Gran Maquina Del Mal. Intelligent Mastering Console.

## 🏗️ Arquitectura

- **Single responsibility per file** — cada archivo tiene UNA sola responsabilidad
- **CSS**: tokens → themes → fonts → reset → grid → shell → components/*
- **JS**: `core/*` (helpers) → `features/*` (funcionalidad)
- **Sin globals** (`window.LGMDM`) — todo via imports explícitos con `<script type="module">`
- **Sin parches** — si algo está roto, se reescribe, no se parchea

## 📁 Estructura

```
app/
├── index.html              ← shell (topbar + sidebar + console)
├── login.html              ← página de login (mock auth)
├── css/
│   ├── _index.css          ← manifest de imports
│   ├── base/
│   │   ├── tokens.css      ← variables estructurales (spacing, radius, z-index)
│   │   ├── themes.css      ← colors por tema (dark/light)
│   │   ├── fonts.css       ← tipografía (headings + utilities)
│   │   ├── reset.css       ← browser reset
│   │   └── grid.css        ← utilidades de grid
│   ├── layout/
│   │   └── shell.css       ← geometría del shell + responsive
│   └── components/
│       ├── header.css      ← topbar
│       ├── sidebar.css     ← sidebar (tabs + panes)
│       ├── console.css     ← workspace console
│       ├── buttons.css     ← .btn + variantes genéricas
│       ├── forms.css       ← inputs + form layout
│       └── auth.css        ← pantalla de login
└── js/
    ├── entry.js            ← bootstrap
    ├── core/
    │   ├── dom.js          ← $, $$, byId
    │   ├── storage.js      ← ls/ss wrappers
    │   ├── api.js          ← fetch wrapper con auth headers
    │   └── state.js        ← store global con subscribe
    └── features/
        ├── auth/
        │   ├── login.js    ← tabs + submit + mock auth
        │   └── session.js  ← check session + redirect + logout
        ├── sidebar/
        │   ├── tabs.js     ← tab switching
        │   └── resize.js   ← drag-to-resize + persist
        └── theme/
            └── switcher.js ← toggle dark/light

reusado/                    ← provenance (cada archivo mergeado tiene su original + diff aquí)
```

## 🚀 Cómo probar local

```bash
cd app
python3 -m http.server 8080
# Abrir http://localhost:8080/
```

## 📜 Reglas de trabajo

1. **1 archivo a la vez** — no bulk commits
2. **Consulta antes de cada acción** (escribir, modificar, mergear) — solo lectura libre
3. **No copy/paste** — cada merge es una reescritura con la mejor versión de cada fuente
4. **Single responsibility** — si un archivo hace 2 cosas, se divide
5. **Sin !important, sin // FIX comments, sin parches**
6. **Colores via `var(--ui-*)` solamente** — nunca hex hardcoded fuera de `themes.css`
7. **Producción NO se toca** — hasta que esté listo y medianamente funcional
