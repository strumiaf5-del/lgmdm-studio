/* ============================================================
   resize.js — Drag-to-resize del sidebar
   ============================================================
   Single responsibility: drag del .resize-handle → cambia --sidebar-w.
   Persiste el ancho en localStorage (sobrevive recargas).
*/

import { $, ls } from '../../core/storage.js';

const STORAGE_KEY = 'master_sidebar_w';
const MIN_W = 220;
const MAX_W = 480;

export function initSidebarResize() {
  const handle = $('.resize-handle');
  if (!handle) return;

  const saved = ls.get(STORAGE_KEY);
  if (typeof saved === 'number') {
    document.documentElement.style.setProperty('--sidebar-w', `${saved}px`);
  }

  handle.addEventListener('mousedown', startDrag);
}

function startDrag(e) {
  e.preventDefault();
  document.body.classList.add('sidebar-dragging');

  const startX = e.clientX;
  const startWidth = currentWidth();

  function onMove(ev) {
    const delta = ev.clientX - startX;
    setWidth(clamp(startWidth + delta, MIN_W, MAX_W));
  }

  function onEnd() {
    document.body.classList.remove('sidebar-dragging');
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    ls.set(STORAGE_KEY, currentWidth());
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
}

function currentWidth() {
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--sidebar-w'),
    10
  ) || MIN_W;
}

function setWidth(px) {
  document.documentElement.style.setProperty('--sidebar-w', `${px}px`);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
