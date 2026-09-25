# COLA de merge — LGMDM Studio

**Fuentes** (solo lectura):

- `/root/nuevoFinal/frontend/dist` — producción actual, con años de parches
- `/root/aporte/` — corregida en algunas cosas, embellecida en otras

**Destino**: `app/`.

**Nada se borra.** Los archives y lo deprecado quedan en su lugar hasta que la
app esté funcional; recién ahí se abre la limpieza. Esta cola los lista para que
conste la decisión, no para tirarlos.

**Flujo por unidad**:

```
diff dist vs aporte  →  explicar qué cambió  →  auditar el mergeado completo
  →  informar  →  VOY DECIDO qué aplica  →  escribir en merge/salida/
  →  copiar a su lugar en app/
```

**1 archivo = 1 responsabilidad.** Si un archivo de origen hace dos cosas, se
divide en dos destinos. La columna *destino en app/* es donde se resuelve eso.

**Estados**: `pendiente` → `analizado` → `informado` → `aprobado` → `escrito` → `promovido`

## Resumen

| G | Grupo | Unidades | Regla |
|---|---|--:|---|
| G1 | idénticos byte a byte en ambas fuentes | 27 | no hay diff → solo decidir si entra |
| G2 | difieren | 46 | diff → informe → decisión |
| G3 | solo en `dist` | 7 | decisión de entrada |
| G4 | solo en `aporte` | 3 | decisión de entrada |
| G5 | familia `pro-features` (código duplicado) | 1 unidad / 17 archivos | unidad = familia, no el archivo |
| G6 | ya escritos en `app/` (Fase 2) | 21 | verificación |
| G7 | archives / deprecado | 63 (5 dirs) | **no se borra** — limpieza al final |

Sumado G1–G4+G5: `100` rutas únicas activas (dist 97, aporte 90, comunes 87: 73 sin contar pro-features).

**Duplicación**: bloques idénticos de 6 líneas presentes en más de un archivo.
Es lo que hace que la unidad de merge no sea siempre un archivo — ver G5.

## G5 — familia `pro-features/` (una sola unidad de merge)

`BaseCanvasWidget` existe en ambas fuentes (147 y 148 líneas), pero **solo una
parte de los widgets lo usa**: se empezó a extraer la base y se abandonó a la
mitad. Por eso el código se repite entre ellos.

Si se mergeara archivo por archivo, **se copiaría la duplicación 17 veces dentro
de `app/`**. Por eso esta familia entra como UNA fila.

| Archivos | Líneas | Usa base | Duplicación (máx. bloques compartidos) |
|--:|--:|--:|---|
| `js/pro-features/reference-match-widget.js` | 352 | **no** | 50 |
| `js/pro-features/saturation-widget.js` | 368 | sí | 40 |
| `js/pro-features/spectral-tilt-widget.js` | 350 | **no** | 36 |
| `js/pro-features/phase-rotation-widget.js` | 420 | sí | 23 |
| `js/pro-features/loudness-penalty-widget.js` | 256 | sí | 22 |
| `js/pro-features/ms-imager-widget.js` | 212 | sí | 8 |
| `js/pro-features/wav-encoder.js` | 102 | **no** | 5 |
| `js/pro-features/dr-meter-widget.js` | 465 | **no** | 3 |
| `js/pro-features/multiband-transient-widget.js` | 399 | **no** | 2 |
| `js/pro-features/cross-demask-widget.js` | 236 | **no** | 1 |
| `js/pro-features/iso-compensation-widget.js` | 153 | **no** | 1 |
| `js/pro-features/loudness-war-widget.js` | 461 | sí | 1 |
| `js/pro-features/phantom-sub-widget.js` | 139 | **no** | 1 |
| `js/pro-features/resonance-tamer-widget.js` | 156 | **no** | 1 |
| `js/pro-features/reverb-widget.js` | 521 | **no** | 1 |
| `js/pro-features/premium-utils.js` | 62 | **no** | — |
| `js/pro-features/visualizer-render.js` | 165 | **no** | — |

| # | Unidad | Archivos | Destino propuesto | Decisión | Estado |
|--:|---|--:|---|---|---|
| 1 | familia `pro-features` | 17 | *por definir según reglas 1, 2 y 4* | pendiente | pendiente |

## G1 — idénticos en ambas fuentes

Sin diff que analizar: son el mismo archivo. Solo decide si entra y a dónde.

| # | Ruta | Líneas | Duplicación interna | Destino en `app/` | Decisión | Estado |
|--:|---|--:|---|---|---|---|
| 1 | `css/base/reset.css` | 91 | — | ? | | pendiente |
| 2 | `css/base/themes-professional.css` | 384 | — | ? | | pendiente |
| 3 | `css/base/themes.css` | 168 | — | ? | | pendiente |
| 4 | `css/base/tokens.css` | 63 | — | ? | | pendiente |
| 5 | `css/components/ai-panel.css` | 325 | — | ? | | pendiente |
| 6 | `css/components/buttons.css` | 144 | — | ? | | pendiente |
| 7 | `css/components/content-area.css` | 144 | — | ? | | pendiente |
| 8 | `css/components/forms.css` | 211 | — | ? | | pendiente |
| 9 | `css/components/header.css` | 192 | — | ? | | pendiente |
| 10 | `css/components/panels.css` | 342 | — | ? | | pendiente |
| 11 | `css/components/preview.css` | 247 | — | ? | | pendiente |
| 12 | `css/components/sidebar.css` | 132 | — | ? | | pendiente |
| 13 | `css/components/utilities.css` | 653 | — | ? | | pendiente |
| 14 | `css/components/workflow.css` | 478 | **5** ← `meters.css`×5 | ? | | pendiente |
| 15 | `css/widgets/chain-family-tabs.css` | 75 | — | ? | | pendiente |
| 16 | `css/widgets/pro-insert-rack.css` | 346 | — | ? | | pendiente |
| 17 | `css/widgets/pro-widgets-v2.css` | 479 | — | ? | | pendiente |
| 18 | `js/00-compat.js` | 75 | — | ? | | pendiente |
| 19 | `js/00-config.js` | 26 | — | ? | | pendiente |
| 20 | `js/00-dom-safety.js` | 47 | — | ? | | pendiente |
| 21 | `js/00-modal-helper.js` | 147 | — | ? | | pendiente |
| 22 | `js/00-theme-manager.js` | 220 | — | ? | | pendiente |
| 23 | `js/00-utils.js` | 114 | — | ? | | pendiente |
| 24 | `js/30-metrics-store.js` | 90 | — | ? | | pendiente |
| 25 | `js/32-chain-family-tabs.js` | 143 | — | ? | | pendiente |
| 26 | `js/32-flex-layout.js` | 130 | — | ? | | pendiente |
| 27 | `js/insert-base.js` | 259 | — | ? | | pendiente |

## G2 — difieren

Cada uno requiere: diff → explicar qué cambió → auditar el mergeado → informar.

| # | Ruta | dist | aporte | Duplicación interna | Destino en `app/` | Decisión | Estado |
|--:|---|--:|--:|---|---|---|---|
| 1 | `css/components/base.css` | 180 | 160 | **4** ← `lgmdm.css`×4 | ? | | pendiente |
| 2 | `css/components/lgmdm-studio.css` | 747 | 696 | — | ? | | pendiente |
| 3 | `css/components/lgmdm.css` | 490 | 499 | **4** ← `base.css`×4 | ? | | pendiente |
| 4 | `css/components/meters.css` | 658 | 650 | **5** ← `workflow.css`×5 | ? | | pendiente |
| 5 | `css/components/studio-pro.css` | 812 | 823 | — | ? | | pendiente |
| 6 | `css/layout/layout-shell.css` | 289 | 284 | — | ? | | pendiente |
| 7 | `css/layout/responsive.css` | 502 | 502 | — | ? | | pendiente |
| 8 | `css/skin/themes-professional-skin.css` | 1079 | 3946 | — | ? | | pendiente |
| 9 | `index.html` | 2030 | 2426 | — | ? | | pendiente |
| 10 | `js/00-api.js` | 301 | 272 | — | ? | | pendiente |
| 11 | `js/00-audio-engine.js` | 48 | 44 | — | ? | | pendiente |
| 12 | `js/00-auth.js` | 395 | 300 | — | ? | | pendiente |
| 13 | `js/00-storage.js` | 44 | 25 | — | ? | | pendiente |
| 14 | `js/00-ui-core.js` | 217 | 208 | — | ? | | pendiente |
| 15 | `js/01-state.js` | 254 | 253 | — | ? | | pendiente |
| 16 | `js/02-sliders-ui.js` | 228 | 196 | — | ? | | pendiente |
| 17 | `js/03-presets.js` | 319 | 253 | — | ? | | pendiente |
| 18 | `js/04-file-handling.js` | 335 | 325 | — | ? | | pendiente |
| 19 | `js/05-eq-waveform.js` | 503 | 480 | **13** ← `10-meters-dashboard.js`×13 | ? | | pendiente |
| 20 | `js/06-params-builder.js` | 723 | 569 | — | ? | | pendiente |
| 21 | `js/07-mastering-actions.js` | 593 | 499 | **1** ← `08-reference-mastering.js`×1 | ? | | pendiente |
| 22 | `js/08-reference-mastering.js` | 1044 | 932 | **1** ← `07-mastering-actions.js`×1 | ? | | pendiente |
| 23 | `js/09-visualizers.js` | 631 | 601 | — | ? | | pendiente |
| 24 | `js/10-meters-dashboard.js` | 386 | 802 | **13** ← `05-eq-waveform.js`×13 | ? | | pendiente |
| 25 | `js/11-ai-assistant-ux.js` | 488 | 383 | — | ? | | pendiente |
| 26 | `js/12-lufs-normalize.js` | 63 | 63 | — | ? | | pendiente |
| 27 | `js/13-mixer-ui.js` | 1556 | 1559 | — | ? | | pendiente |
| 28 | `js/13-mixer.js` | 479 | 486 | — | ? | | pendiente |
| 29 | `js/14-pitch-correction.js` | 305 | 285 | — | ? | | pendiente |
| 30 | `js/15-master-console.js` | 676 | 618 | — | ? | | pendiente |
| 31 | `js/18-undo-redo.js` | 307 | 297 | — | ? | | pendiente |
| 32 | `js/20-pro-upgrades.js` | 95 | 92 | — | ? | | pendiente |
| 33 | `js/22-tabs-handler.js` | 109 | 124 | — | ? | | pendiente |
| 34 | `js/25-workspace-tabs.js` | 96 | 95 | — | ? | | pendiente |
| 35 | `js/29-analysis-view.js` | 137 | 137 | — | ? | | pendiente |
| 36 | `js/30-preview-controller.js` | 511 | 445 | **1** ← `44-timeline-meters.js`×1 | ? | | pendiente |
| 37 | `js/34-premium-suite.js` | 2925 | 3242 | **5** ← `wav-encoder.js`×5 | ? | | pendiente |
| 38 | `js/35-audio-tap.js` | 202 | 210 | — | ? | | pendiente |
| 39 | `js/36-base-canvas-widget.js` | 133 | 132 | **1** ← `spectral-tilt-widget.js`×1, `reference-match-widget.js`×1 | ? | | pendiente |
| 40 | `js/40-tab-compliance.js` | 26 | 26 | — | ? | | pendiente |
| 41 | `js/41-tab-abx.js` | 26 | 26 | — | ? | | pendiente |
| 42 | `js/42-tab-codec.js` | 25 | 25 | — | ? | | pendiente |
| 43 | `js/43-tab-waterfall.js` | 25 | 25 | — | ? | | pendiente |
| 44 | `js/pro-insert-rack.js` | 711 | 710 | — | ? | | pendiente |
| 45 | `js/reference-library-picker.js` | 235 | 233 | — | ? | | pendiente |
| 46 | `login.html` | 71 | 475 | — | ? | | pendiente |

## G3 — solo en `dist`

| # | Ruta | Líneas | Destino en `app/` | Decisión | Estado |
|--:|---|--:|---|---|---|
| 1 | `css/components/_index.css` | 17 | ? | | pendiente |
| 2 | `css/components/studio.css` | 339 | ? | | pendiente |
| 3 | `css/login-inline.css` | 204 | ? | | pendiente |
| 4 | `js/00-state-helpers.js` | 51 | ? | | pendiente |
| 5 | `js/12-proactive-detection.js` | 348 | ? | | pendiente |
| 6 | `js/44-timeline-meters.js` | 204 | ? | | pendiente |
| 7 | `js/login-inline.js` | 172 | ? | | pendiente |

## G4 — solo en `aporte`

| # | Ruta | Líneas | Destino en `app/` | Decisión | Estado |
|--:|---|--:|---|---|---|
| 1 | `css/components/dashboard.css` | 8 | ? | | pendiente |
| 2 | `js/15-master-visual-suite.js` | 1447 | ? | | pendiente |
| 3 | `js/17-keyboard-shortcuts.js` | 319 | ? | | pendiente |

## G6 — ya escritos en `app/` (Fase 2) — verificación

Estos archivos ya están en el repo. `reusado/` guarda su **antes**.
A verificar que salieron de un merge real de `dist`/`aporte`, no de cero.

| # | En `app/` | En `reusado/` (el antes) | ¿Existe el par en fuentes? | ¿Existe en `app/`? | Estado |
|--:|---|---|---|---|---|
| 1 | `css/_index.css` | ✓ | ninguna | ✓ | pendiente |
| 2 | `css/base/fonts.css` | ✓ | ninguna | ✓ | pendiente |
| 3 | `css/base/grid.css` | ✓ | ninguna | ✓ | pendiente |
| 4 | `css/base/reset.css` | ✓ | ambas | ✓ | pendiente |
| 5 | `css/base/themes.css` | ✓ | ambas | ✓ | pendiente |
| 6 | `css/base/tokens.css` | ✓ | ambas | ✓ | pendiente |
| 7 | `css/components/auth.css` | ✓ | ninguna | ✓ | pendiente |
| 8 | `css/components/buttons.css` | ✓ | ambas | ✓ | pendiente |
| 9 | `css/components/console.css` | ✓ | ninguna | ✓ | pendiente |
| 10 | `css/components/forms.css` | ✓ | ambas | ✓ | pendiente |
| 11 | `css/components/header.css` | ✓ | ambas | ✓ | pendiente |
| 12 | `css/components/sidebar.css` | ✓ | ambas | ✓ | pendiente |
| 13 | `css/layout/shell.css` | ✓ | ninguna | ✓ | pendiente |
| 14 | `index.html` | ✓ | ambas | ✓ | pendiente |
| 15 | `js/entry.js` | ✓ | ninguna | ✓ | pendiente |
| 16 | `js/features/auth/login.js` | ✓ | ninguna | ✓ | pendiente |
| 17 | `js/features/auth/session.js` | ✓ | ninguna | ✓ | pendiente |
| 18 | `js/features/sidebar/resize.js` | ✓ | ninguna | ✓ | pendiente |
| 19 | `js/features/sidebar/tabs.js` | ✓ | ninguna | ✓ | pendiente |
| 20 | `js/features/theme/switcher.js` | ✓ | ninguna | ✓ | pendiente |
| 21 | `login.html` | ✓ | ambas | ✓ | pendiente |

## G7 — archives y deprecado

**No se borra nada.** Se listan para que conste que existen y que la limpieza
queda para cuando la app esté funcional.

| Directorio | Archivos | Decisión | Estado |
|---|--:|---|---|
| `_deprecated/` | 1 (dist) | no tocar — limpiar al final | pendiente |
| `css/_archive/` | 1 (aporte) | no tocar — limpiar al final | pendiente |
| `css/_legacy_archive/` | 2 (aporte) | no tocar — limpiar al final | pendiente |
| `js/_archive/` | 30 (dist) | no tocar — limpiar al final | pendiente |
| `js/_legacy_archive/` | 29 (aporte) | no tocar — limpiar al final | pendiente |

---

## Notas de proceso

- **Commits**: dos por unidad, cada uno de un solo archivo — primero el
  informe en `merge/informes/`, después el código promovido a `app/`.
- **`merge/dist/`, `merge/aporte/`, `merge/salida/`** no se commitean (ver
  `.gitignore`): son copias regenerables de fuentes de solo lectura.
- **Auditoría**: `node --check` no sirve en este repo (devuelve 0 con sintaxis
  rota en ESM). Usar `node --check --input-type=module < archivo`.

