/* ============================================================
   resize.js — Drag-to-resize del sidebar
   ============================================================
   Single responsibility: drag del .resize-handle → cambia --sidebar-w.
   Persiste el ancho en localStorage (sobrevive recargas).
   Soporta mouse + touch (móvil/tablet).
*/

import { $, ls } from '../../core/storage.js';
import { $ as doc } from '../../core/dom.js';

const STORAGE_KEY = 'master_sidebar_w';

function readVarPx(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function initSidebarResize() {
  const handle = $('.resize-handle');
  if (!handle) return;

  const saved = ls.get(STORAGE_KEY);
  if (typeof saved === 'number') {
    document.documentElement.style.setProperty('--sidebar-w', `${saved}px`);
  }

  handle.addEventListener('mousedown', startDrag);
  handle.addEventListener('touchstart', startDrag, { passive: false });
}

function startDrag(e) {
  e.preventDefault();
  document.body.classList.add('sidebar-dragging');

  const startX = clientX(e);
  const startWidth = currentWidth();
  const minW = readVarPx('--sidebar-w-min', 220);
  const maxW = readVarPx('--sidebar-w-max', 480);

  function onMove(ev) {
    const delta = clientX(ev) - startX;
    setWidth(clamp(startWidth + delta, minW, maxW));
  }

  function onEnd() {
    document.body.classList.remove('sidebar-dragging');
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
    ls.set(STORAGE_KEY, currentWidth());
  }

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
}

function clientX(e) {
  if (e.touches && e.touches.length) return e.touches[0].clientX;
  if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0].clientX;
  return e.clientX;
}

function currentWidth() {
  return readVarPx('--sidebar-w', readVarPx('--sidebar-w-min', 220));
}

function setWidth(px) {
  document.documentElement.style.setProperty('--sidebar-w', `${px}px`);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
