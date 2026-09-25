/* ============================================================
   toast.js — Sistema de notificaciones toast
   ============================================================
   Single responsibility: show/hide toast notifications.
   API: toast.success(msg), toast.error(msg), toast.info(msg)
*/

import { byId } from '../../core/dom.js';

const DURATIONS = {
  success: 3000,
  error: 5000,
  info: 3000,
};

// Debe matchear var(--t-fast) en toast.css (animation: toast-out)
const LEAVE_OFFSET_MS = 120;

export const toast = {
  success: (msg) => show(msg, 'success'),
  error:   (msg) => show(msg, 'error'),
  info:    (msg) => show(msg, 'info'),
};

function show(msg, type) {
  const container = byId('toast-container') || createContainer();
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.classList.add('toast--leave'), DURATIONS[type] - LEAVE_OFFSET_MS);
  setTimeout(() => el.remove(), DURATIONS[type]);
}

function createContainer() {
  const c = document.createElement('div');
  c.id = 'toast-container';
  c.className = 'toast-container';
  document.body.appendChild(c);
  return c;
}
