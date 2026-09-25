/* ============================================================
   audio.js — Audio canvas (server-side processing)
   ============================================================
   Single responsibility: subir audio al backend y mostrar
   telemetría (spectrum + duration) en un canvas.
   NO decodifica audio en el cliente — todo del lado del servidor.
*/

import { $ } from '../../core/dom.js';
import { apiFetch } from '../../core/api.js';
import { set as setState } from '../../core/state.js';
import { toast } from '../ui/toast.js';

const POLL_INTERVAL_MS = 500;
const POLL_TIMEOUT_MS = 30000;
const MAX_FILE_SIZE_MB = 50;

let pollingCancelled = false;

export function initAudioCanvas() {
  const consoleEl = $('.console');
  if (!consoleEl) return;

  const placeholder = consoleEl.querySelector('.console__placeholder');
  if (placeholder) placeholder.remove();

  consoleEl.appendChild(buildWidget());
  attachUpload();
}

function buildWidget() {
  const wrap = document.createElement('div');
  wrap.className = 'audio-canvas';
  wrap.innerHTML = `
    <div class="audio-canvas__header">
      <label class="btn btn--ghost">
        <span>Cargar audio</span>
        <input type="file" accept="audio/*" hidden>
      </label>
      <span class="audio-canvas__status">Sin audio</span>
    </div>
    <div class="audio-canvas__meta hidden">
      <span class="audio-canvas__duration">—</span>
      <span class="audio-canvas__source-id"></span>
    </div>
    <div class="canvas-host">
      <canvas class="audio-canvas__spectrum"></canvas>
    </div>
    <div class="audio-canvas__progress hidden">
      <div class="audio-canvas__progress-bar"></div>
    </div>
  `;
  return wrap;
}

function attachUpload() {
  const fileInput = $('.audio-canvas input[type="file"]');
  if (!fileInput) return;
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  });
}

function validateFile(file) {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `Archivo demasiado grande (max ${MAX_FILE_SIZE_MB}MB)`;
  }
  if (file.type && !file.type.startsWith('audio/')) {
    return `Tipo no soportado: ${file.type}. Use un archivo de audio.`;
  }
  return null;
}

async function handleUpload(file) {
  const status = $('.audio-canvas__status');
  const meta = $('.audio-canvas__meta');
  const sourceIdEl = $('.audio-canvas__source-id');
  const durationEl = $('.audio-canvas__duration');
  const progress = $('.audio-canvas__progress');
  const progressBar = $('.audio-canvas__progress-bar');
  const canvas = $('.audio-canvas__spectrum');

  const error = validateFile(file);
  if (error) {
    toast.error(error);
    return;
  }

  pollingCancelled = false;

  if (status) status.textContent = `Subiendo ${file.name}…`;
  if (meta) meta.classList.add('hidden');
  if (progress) progress.classList.remove('hidden');
  if (progressBar) progressBar.style.width = '0%';

  try {
    const formData = new FormData();
    formData.append('file', file);

    const source = await apiFetch('/preview/source', {
      method: 'POST',
      body: formData,
    });

    if (sourceIdEl) sourceIdEl.textContent = source.source_id;
    if (durationEl) durationEl.textContent = `${source.duration_sec.toFixed(2)} s`;
    if (meta) meta.classList.remove('hidden');
    if (status) status.textContent = `Procesando ${file.name}…`;

    setState('source', {
      source_id: source.source_id,
      duration_sec: source.duration_sec,
      filename: file.name,
    });

    await pollProgress(source.source_id, progressBar);

    if (pollingCancelled) return;

    const meters = await apiFetch(`/preview/meters/${source.source_id}`);
    if (canvas && meters.spectrum) {
      drawSpectrum(canvas, meters.spectrum);
    }
    if (status) status.textContent = `${file.name} · listo`;
    if (progress) progress.classList.add('hidden');
    toast.success(`Audio cargado: ${file.name}`);
  } catch (err) {
    if (status) status.textContent = `Error: ${err.message}`;
    if (progress) progress.classList.add('hidden');
    toast.error(`Error al cargar audio: ${err.message}`);
  }
}

export function cancelAudioPolling() {
  pollingCancelled = true;
}

async function pollProgress(sourceId, progressBar) {
  const start = Date.now();
  while (Date.now() - start < POLL_TIMEOUT_MS) {
    if (pollingCancelled) throw new Error('Polling cancelado');
    const res = await apiFetch(`/preview/progress/${sourceId}`);
    const pct = Math.round((res.progress || 0) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;

    if (res.status === 'ready' || res.status === 'error') return res;
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error('Timeout esperando telemetría');
}

function drawSpectrum(canvas, spectrum) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--ui-accent').trim() || '#42e8ff';

  ctx.fillStyle = accent;
  ctx.strokeStyle = accent;

  const n = spectrum.length;
  const barW = Math.max(1, rect.width / n);
  const midY = rect.height / 2;

  spectrum.forEach((v, i) => {
    const h = Math.abs(v) * midY;
    const x = i * barW;
    ctx.fillRect(x, midY - h, barW - 1, h * 2);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
