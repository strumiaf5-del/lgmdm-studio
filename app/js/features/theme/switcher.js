/* ============================================================
   switcher.js — Theme switcher
   ============================================================
   Single responsibility: alternar data-theme="light" en <html>.
   Persiste en localStorage. Lee preferencia al cargar.
*/

import { $, ls } from '../../core/storage.js';

const STORAGE_KEY = 'master_theme';
const LIGHT = 'light';

export function initThemeSwitcher() {
  const saved = ls.get(STORAGE_KEY);
  if (saved === LIGHT) {
    document.documentElement.setAttribute('data-theme', LIGHT);
  }

  const btn = $('button[aria-label="Cambiar tema"]');
  if (!btn) return;

  btn.addEventListener('click', toggle);
}

function toggle() {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === LIGHT;

  if (isLight) {
    html.removeAttribute('data-theme');
    ls.set(STORAGE_KEY, '');
  } else {
    html.setAttribute('data-theme', LIGHT);
    ls.set(STORAGE_KEY, LIGHT);
  }
}
