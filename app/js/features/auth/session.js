/* ============================================================
   session.js — Manejo de sesión
   ============================================================
   Single responsibility: verificar sesión activa y poblar topbar.
   Si no hay token → redirige a login.html.
   Si hay token → popula el user bar + wire logout.
*/

import { $ } from '../../core/dom.js';
import { ss } from '../../core/storage.js';

const TOKEN_KEY = 'master_auth_token';
const USER_KEY  = 'master_auth_user';
const LOGIN_PAGE = 'login.html';

export function initSession() {
  const token = ss.get(TOKEN_KEY);
  if (!token) {
    window.location.replace(LOGIN_PAGE);
    return false;
  }

  populateUserBar();
  return true;
}

function populateUserBar() {
  const user = ss.get(USER_KEY);
  if (!user) return;

  const userBar = $('.topbar__user');
  if (userBar) {
    userBar.removeAttribute('hidden');
    const nameEl = userBar.querySelector('.topbar__user-name');
    if (nameEl) nameEl.textContent = user.name || user.email;
  }

  const logoutBtn = $('button[aria-label="Cerrar sesión"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

export function logout() {
  ss.remove(TOKEN_KEY);
  ss.remove(USER_KEY);
  window.location.replace(LOGIN_PAGE);
}
