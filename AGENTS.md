# AGENTS.md

Frontend estático de **LGMDM Studio** (La Gran Maquina Del Mal) — rebuild desde cero.
Sin `package.json`, sin build, sin tests, sin linter, sin CI. JS puro con
`<script type="module">`, CSS con `@import`.

## ⚠️ Verificación: `node --check` NO sirve acá

`node --check app/js/foo.js` devuelve **0 incluso con sintaxis rota**. Al detectar
`import`/`export` Node clasifica el archivo como ESM y no lo parsea. Cada "✓ OK"
obtenido con ese comando es un falso positivo.

Usá stdin para que lo trate como módulo (el error sale como `[stdin]`, por eso hace
falta el `echo` que identifica el archivo):

```bash
# un archivo
node --check --input-type=module < app/js/entry.js

# barrido — sin salida = todo OK
find app/js -name '*.js' -exec sh -c \
  'node --check --input-type=module < "$1" || echo "FAIL $1"' _ {} \;
```

Verificado en este repo: 16 archivos OK, y sí detecta errores inyectados.

## Cómo probar

```bash
cd app && python3 -m http.server 8080   # http://localhost:8080/
```

Eso sirve **solo estático**: `/api/*` responde 404 porque `http.server` no tiene
proxy. El backend (uvicorn en `127.0.0.1:8000`) queda atrás de Caddy, que hace
strip del prefijo `/api`. La UI se puede revisar sin backend; las llamadas a API
no.

**El backend es de solo lectura para este trabajo.** Cualquier cambio requiere
autorización explícita del usuario.

## Arquitectura — lo que no se deduce de los nombres

- **CSS: un solo manifiesto.** Todo entra por `app/css/_index.css`; el orden importa
  (tokens → themes → fonts → reset → grid → layout → components). Nunca linkear un
  `.css` individual desde HTML.
- **Dos entrypoints HTML**, con JS distinto: `index.html` → `js/entry.js`;
  `login.html` → `js/features/auth/login.js` (no carga `entry.js`).
- **`entry.js` se traga todo lo demás**: `if (!initSession()) return;` — si la sesión
  falla, ningún feature se inicializa. Un feature "que no anda" suele ser esto.
- **`params-schema.js` es la única fuente de verdad** de los 163 parámetros / 32
  secciones (verificable: `PARAMS_SCHEMA.length` y `Object.keys(DEFAULTS).length`).
  El panel, el reset y el payload de render se derivan de ahí. Agregar un parámetro =
  agregarlo al schema, no tocar `mastering.js`.
- **HTTP pasa solo por `core/api.js`**: `apiFetch()` para JSON, `apiFetchBlob()` para
  binario (WAV). Nunca `fetch()` directo — salta timeout de 30s, auth y logging, y
  duplica `BASE_PATH` (bug real, commit `828f5c5`).
- **Dos archivos de tokens, no uno**: estructura en `base/tokens.css`, colores en
  `base/themes.css`. `--ui-*` se define solo en themes.
- **Consistencia HTML↔CSS del shell**: la clase es `.app-shell` (13 usos en `shell.css`).
  Renombrarla en un lado sin el otro rompe todo el layout.

## Convenciones que no son las default

- **1 archivo por commit.** Nada de cambios en bloque.
- **Preguntar antes de escribir/modificar/mergear.** Explorar y leer es libre.
- **Sin parches**: no `// FIX`, no `!important` (la única excepción es el bloque
  `prefers-reduced-motion` en `base/reset.css`), no workarounds. Si algo está roto se
  reescribe.
- **Cero hex fuera de `themes.css`.** En JS los fallbacks de `cssVar('--ui-x', '#…')`
  están aceptados: el token siempre gana y el hex solo se usa si falta.
- **Reescritura, no copy/paste.** Cada merge toma la mejor versión de cada fuente.
- En respuestas al usuario: no usar las palabras `deploy`, `producción` ni `sync`.

## Gotchas

- **`reusado/` es solo local** (gitignored, 21 archivos de provenance). Nunca se
  empuja ni se borra.
- **`favicon.svg` no existe** en `app/` aunque ambos HTML lo referencian.
- **`README.md` está desactualizado**: su árbol de directorios omite
  `features/canvas/*` (5 archivos), `features/ui/toast.js` y varios
  `css/components/*.css`. Enumerar el filesystem, no confiar en el README.
- **Grep con variables**: un `$var` que empieza con `--` se interpreta como flag y
  falla en silencio (da falso "no encontrado"). Usar `grep -F` o `grep -e`.
- **Grep da falsos positivos** sobre valores reemplazados por `var()`. Verificar con
  un `grep` dirigido a la línea exacta antes de concluir que un bug sigue.
- **Timings JS↔CSS**: `LEAVE_OFFSET_MS` en `toast.js` debe igualar `--t-fast` de
  `toast.css`. Cambiar uno sin el otro desincroniza la animación de salida.
- **Fuentes de referencia** (solo lectura, para diff/merge): `/root/nuevoFinal/frontend/dist/`
  y `/root/aporte/`.

## Endpoints usados por este frontend

| Método | Path | Uso |
|---|---|---|
| POST | `/api/preview/source` | subir audio (multipart) |
| GET | `/api/preview/progress/{source_id}` | polling de procesamiento |
| GET | `/api/preview/meters/{source_id}` | meters + spectrum |
| POST | `/api/preview` | render del preview (devuelve WAV) |

Auth: mock — cualquier email/password entra; el token queda en `sessionStorage`
bajo `master_auth_token`.
