/* ============================================================
   eq.js — EQ visualizer (frequency response, log scale)
   ============================================================
   Single responsibility: renderizar espectro con escala
   logarítmica de frecuencia y escala dB.
   Lee del state global (seteado por audio.js).
*/

import { $ } from '../../core/dom.js';
import { subscribe } from '../../core/state.js';
import { apiFetch } from '../../core/api.js';

const F_MIN = 20;
const F_MAX = 20000;
const DB_MIN = -80;
const DB_MAX = 0;
const DEFAULT_SR = 44100;

export function initEqCanvas() {
  const consoleEl = $('.console');
  if (!consoleEl) return;

  const widget = buildWidget();
  consoleEl.appendChild(widget);
  const canvas = widget.querySelector('.eq-canvas__spectrum');

  subscribe('source', (source) => {
    if (!source?.source_id) return;
    fetchAndRender(canvas, source.source_id);
  });
}

function buildWidget() {
  const wrap = document.createElement('div');
  wrap.className = 'eq-canvas';
  wrap.innerHTML = `
    <h3 class="eq-canvas__title">EQ Analyzer</h3>
    <div class="canvas-host">
      <canvas class="eq-canvas__spectrum"></canvas>
    </div>
  `;
  return wrap;
}

async function fetchAndRender(canvas, sourceId) {
  try {
    const meters = await apiFetch(`/preview/meters/${sourceId}`);
    if (meters.spectrum) drawSpectrum(canvas, meters.spectrum, meters.sample_rate);
  } catch (err) {
    console.warn('[eq] fetch failed:', err.message);
  }
}

function freqForBin(i, totalBins, sampleRate) {
  return (i * sampleRate / 2) / totalBins;
}

function dbToY(db, h, padTop) {
  const clamped = Math.max(DB_MIN, Math.min(DB_MAX, db));
  return padTop + ((DB_MAX - clamped) / (DB_MAX - DB_MIN)) * h;
}

function freqToX(freq, w, padLeft) {
  return padLeft + (Math.log10(freq / F_MIN) / Math.log10(F_MAX / F_MIN)) * w;
}

function drawSpectrum(canvas, spectrum, sampleRate = DEFAULT_SR) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const accent = cssVar('--ui-accent', '#42e8ff');
  const muted = cssVar('--ui-muted', '#6c7691');
  const text = cssVar('--ui-text', '#e8eaf0');

  const padTop = 16, padBottom = 28, padLeft = 48, padRight = 12;
  const w = rect.width - padLeft - padRight;
  const h = rect.height - padTop - padBottom;

  ctx.font = '10px var(--font-mono, monospace)';

  ctx.strokeStyle = muted + '33';
  ctx.fillStyle = text;
  ctx.lineWidth = 1;

  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let db = 0; db >= DB_MIN; db -= 20) {
    const y = dbToY(db, h, padTop);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(padLeft + w, y);
    ctx.stroke();
    ctx.fillText(`${db}`, padLeft - 6, y);
  }
  ctx.fillText('dB', padLeft - 6, padTop - 8);

  const labels = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  labels.forEach(f => {
    const x = freqToX(f, w, padLeft);
    ctx.beginPath();
    ctx.moveTo(x, padTop);
    ctx.lineTo(x, padTop + h);
    ctx.stroke();
    ctx.fillText(f >= 1000 ? `${f / 1000}k` : `${f}`, x, padTop + h + 6);
  });

  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  let started = false;
  const totalBins = spectrum.length;
  for (let i = 0; i < totalBins; i++) {
    const freq = freqForBin(i, totalBins, sampleRate);
    if (freq < F_MIN || freq > F_MAX) continue;
    const db = spectrum[i];
    if (typeof db !== 'number' || !isFinite(db)) continue;
    const x = freqToX(freq, w, padLeft);
    const y = dbToY(db, h, padTop);
    if (!started) { ctx.moveTo(x, y); started = true; }
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function cssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
