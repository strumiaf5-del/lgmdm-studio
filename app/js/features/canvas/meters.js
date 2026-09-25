/* ============================================================
   meters.js — Meters canvas (peak/RMS/LUFS visualization)
   ============================================================
   Single responsibility: mostrar meters del source activo
   (peak_db, rms_db, lufs, true_peak_db, stereo_correlation).
   Lee del state global (seteado por audio.js tras upload).
*/

import { $ } from '../../core/dom.js';
import { subscribe } from '../../core/state.js';
import { apiFetch } from '../../core/api.js';
import { toast } from '../ui/toast.js';

const DB_MIN = -60;
const DB_MAX = 0;

export function initMetersCanvas() {
  const consoleEl = $('.console');
  if (!consoleEl) return;

  const widget = buildWidget();
  consoleEl.appendChild(widget);

  subscribe('source', (source) => {
    if (!source?.source_id) {
      clearMeters(widget);
      return;
    }
    fetchAndRender(widget, source.source_id);
  });
}

function buildWidget() {
  const wrap = document.createElement('div');
  wrap.className = 'meters-canvas';
  wrap.innerHTML = `
    <h3 class="meters-canvas__title">Meters</h3>
    <div class="meters-canvas__grid">
      <div class="meters-canvas__item">
        <span class="meters-canvas__label">Peak</span>
        <div class="meters-canvas__bar"><div class="meters-canvas__fill" data-meter="peak_db"></div></div>
        <span class="meters-canvas__value" data-value="peak_db">— dB</span>
      </div>
      <div class="meters-canvas__item">
        <span class="meters-canvas__label">RMS</span>
        <div class="meters-canvas__bar"><div class="meters-canvas__fill" data-meter="rms_db"></div></div>
        <span class="meters-canvas__value" data-value="rms_db">— dB</span>
      </div>
      <div class="meters-canvas__item">
        <span class="meters-canvas__label">True Peak</span>
        <div class="meters-canvas__bar"><div class="meters-canvas__fill" data-meter="true_peak_db"></div></div>
        <span class="meters-canvas__value" data-value="true_peak_db">— dB</span>
      </div>
      <div class="meters-canvas__item meters-canvas__item--big">
        <span class="meters-canvas__label">LUFS</span>
        <span class="meters-canvas__big" data-value="lufs">—</span>
      </div>
      <div class="meters-canvas__item meters-canvas__item--wide">
        <span class="meters-canvas__label">Stereo Correlation</span>
        <div class="meters-canvas__correlation">
          <div class="meters-canvas__corr-center"></div>
          <div class="meters-canvas__corr-marker" data-corr-marker></div>
        </div>
        <span class="meters-canvas__value" data-value="stereo_correlation">—</span>
      </div>
    </div>
  `;
  return wrap;
}

async function fetchAndRender(widget, sourceId) {
  try {
    const meters = await apiFetch(`/preview/meters/${sourceId}`);
    renderMeters(widget, meters);
  } catch (err) {
    toast.error(`Meters no disponibles: ${err.message}`);
  }
}

function renderMeters(widget, meters) {
  setBar(widget, 'peak_db', meters.peak_db);
  setBar(widget, 'rms_db', meters.rms_db);
  setBar(widget, 'true_peak_db', meters.true_peak_db);

  setText(widget, 'lufs', typeof meters.lufs === 'number' ? meters.lufs.toFixed(1) : '—');
  setText(widget, 'stereo_correlation', typeof meters.stereo_correlation === 'number' ? meters.stereo_correlation.toFixed(2) : '—');

  const marker = widget.querySelector('[data-corr-marker]');
  if (marker && typeof meters.stereo_correlation === 'number') {
    const pct = ((meters.stereo_correlation + 1) / 2) * 100;
    marker.style.left = `${pct}%`;
  }
}

function setBar(widget, key, db) {
  const fill = widget.querySelector(`[data-meter="${key}"]`);
  const valEl = widget.querySelector(`[data-value="${key}"]`);
  if (typeof db !== 'number') return;
  const pct = Math.max(0, Math.min(100, ((db - DB_MIN) / (DB_MAX - DB_MIN)) * 100));
  if (fill) fill.style.width = `${pct}%`;
  if (valEl) valEl.textContent = `${db.toFixed(1)} dB`;
}

function setText(widget, key, text) {
  const el = widget.querySelector(`[data-value="${key}"]`);
  if (el) el.textContent = text;
}

function clearMeters(widget) {
  widget.querySelectorAll('.meters-canvas__fill').forEach(el => el.style.width = '0%');
  widget.querySelectorAll('.meters-canvas__value, .meters-canvas__big').forEach(el => el.textContent = '—');
  const marker = widget.querySelector('[data-corr-marker]');
  if (marker) marker.style.left = '50%';
}
