/* ============================================================
   mastering.js — Mastering controls panel + render + player
   ============================================================
   Single responsibility: renderizar el panel desde params-schema,
   capturar valores, llamar al backend para renderizar preview,
   mostrar resultado (player + download).
*/

import { $, $$ } from '../../core/dom.js';
import { get, subscribe } from '../../core/state.js';
import { apiFetch } from '../../core/api.js';
import { toast } from '../ui/toast.js';
import { PARAMS_SCHEMA, DEFAULTS } from './params-schema.js';

let currentSource = null;

export function initMasteringPanel() {
  const consoleEl = $('.console');
  if (!consoleEl) return;

  const panel = buildPanel();
  consoleEl.appendChild(panel);

  attachRender(panel);
  attachParamListeners(panel);

  subscribe('source', (source) => {
    currentSource = source;
    updateRenderButton(panel);
  });
}

/* ── Build ───────────────────────────────────────────────── */
function buildPanel() {
  const wrap = document.createElement('div');
  wrap.className = 'mastering-panel';
  wrap.innerHTML = `
    <div class="mastering-panel__header">
      <h3 class="mastering-panel__title">Mastering</h3>
      <div class="mastering-panel__actions">
        <button class="btn btn--ghost" type="button" data-action="reset">Reset</button>
        <button class="btn btn--primary" type="button" data-action="render" disabled>▶ Render Preview</button>
      </div>
    </div>

    <div class="mastering-panel__status hidden">
      <span class="mastering-panel__status-text"></span>
    </div>

    <div class="mastering-panel__sections">
      ${renderSections()}
    </div>

    <div class="mastering-panel__result hidden">
      <h4>Resultado</h4>
      <audio class="mastering-panel__audio" controls></audio>
      <a class="btn btn--ghost mastering-panel__download" download="lgmdm-preview.wav">⬇ Descargar WAV</a>
    </div>
  `;
  return wrap;
}

function renderSections() {
  return PARAMS_SCHEMA.map(section => `
    <details class="mastering-section" data-section="${section.id}">
      <summary class="mastering-section__title">${section.title}</summary>
      <div class="mastering-section__params">
        ${section.params.map(renderParam).join('')}
      </div>
    </details>
  `).join('');
}

function renderParam(p) {
  if (p.type === 'checkbox') {
    return `
      <label class="mastering-param mastering-param--checkbox">
        <input type="checkbox" data-key="${p.key}" ${p.default ? 'checked' : ''}>
        <span>${p.label}</span>
      </label>
    `;
  }
  if (p.type === 'select') {
    return `
      <label class="mastering-param">
        <span class="mastering-param__label">${p.label}</span>
        <select data-key="${p.key}">
          ${p.options.map(o => `<option value="${o.value}" ${o.value === p.default ? 'selected' : ''}>${o.label}</option>`).join('')}
        </select>
      </label>
    `;
  }
  return `
    <label class="mastering-param">
      <span class="mastering-param__label">${p.label}</span>
      <input type="range" data-key="${p.key}" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.default}">
      <span class="mastering-param__value" data-value-for="${p.key}">${formatValue(p.default, p.unit)}</span>
    </label>
  `;
}

function formatValue(v, unit) {
  if (typeof v !== 'number') return '—';
  const formatted = (v >= 100 || v <= -100) ? v.toFixed(0) : v.toFixed(2);
  return unit ? `${formatted} ${unit}` : formatted;
}

/* ── Listeners ──────────────────────────────────────────── */
function attachParamListeners(panel) {
  panel.addEventListener('input', (e) => {
    const target = e.target;
    const key = target.dataset.key;
    if (!key) return;

    if (target.type === 'checkbox') {
      DEFAULTS[key] = target.checked;
    } else if (target.type === 'range') {
      const val = parseFloat(target.value);
      DEFAULTS[key] = val;
      const display = panel.querySelector(`[data-value-for="${key}"]`);
      const p = findParam(key);
      if (display && p) display.textContent = formatValue(val, p.unit);
    } else if (target.tagName === 'SELECT') {
      DEFAULTS[key] = target.value;
    }
  });

  panel.querySelector('[data-action="reset"]').addEventListener('click', () => {
    resetParams(panel);
    toast.info('Parámetros restaurados a defaults');
  });
}

function findParam(key) {
  for (const s of PARAMS_SCHEMA) {
    const p = s.params.find(p => p.key === key);
    if (p) return p;
  }
  return null;
}

function resetParams(panel) {
  PARAMS_SCHEMA.forEach(s => s.params.forEach(p => {
    DEFAULTS[p.key] = p.default;
    const input = panel.querySelector(`[data-key="${p.key}"]`);
    if (input) {
      if (input.type === 'checkbox') input.checked = p.default;
      else if (input.type === 'select') input.value = p.default;
      else input.value = p.default;
    }
    const display = panel.querySelector(`[data-value-for="${p.key}"]`);
    if (display && p.type === 'range') display.textContent = formatValue(p.default, p.unit);
  }));
}

function attachRender(panel) {
  const btn = panel.querySelector('[data-action="render"]');
  btn.addEventListener('click', () => doRender(panel));
}

function updateRenderButton(panel) {
  const btn = panel.querySelector('[data-action="render"]');
  btn.disabled = !currentSource?.source_id;
}

/* ── Render ─────────────────────────────────────────────── */
async function doRender(panel) {
  if (!currentSource?.source_id) {
    toast.error('Subí un audio primero');
    return;
  }

  const btn = panel.querySelector('[data-action="render"]');
  const status = panel.querySelector('.mastering-panel__status');
  const statusText = panel.querySelector('.mastering-panel__status-text');
  const result = panel.querySelector('.mastering-panel__result');

  btn.disabled = true;
  status.classList.remove('hidden');
  statusText.textContent = 'Renderizando preview…';

  try {
    const params = { ...DEFAULTS };
    const res = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('master_auth_token')}` },
      body: JSON.stringify({
        preview_source_id: currentSource.source_id,
        preview_duration_sec: 25,
        params,
      }),
    });

    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const audio = panel.querySelector('.mastering-panel__audio');
    const download = panel.querySelector('.mastering-panel__download');
    audio.src = url;
    download.href = url;
    result.classList.remove('hidden');

    statusText.textContent = 'Listo ✓';
    toast.success('Preview renderizado');
  } catch (err) {
    statusText.textContent = `Error: ${err.message}`;
    toast.error(`Render falló: ${err.message}`);
  } finally {
    btn.disabled = false;
    setTimeout(() => status.classList.add('hidden'), 2000);
  }
}
