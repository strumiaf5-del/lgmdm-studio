/* ============================================================
   login.js — Lógica del form de login
   ============================================================
   Single responsibility: tabs + submit de login.html.
   Mock auth: cualquier email/password funciona.
   Después de login OK → guarda session → redirige a index.html.
*/

import { byId } from '../../core/dom.js';
import { ss } from '../../core/storage.js';

const TOKEN_KEY = 'master_auth_token';
const USER_KEY  = 'master_auth_user';
const HOME = 'index.html';

export function initLogin() {
  initTabs();
  initLoginSubmit();
  initRegisterSubmit();
}

function initTabs() {
  byId('tab-login')?.addEventListener('click', () => switchTab('login'));
  byId('tab-register')?.addEventListener('click', () => switchTab('register'));
}

function switchTab(which) {
  const tabs = {
    login: { btn: byId('tab-login'), pane: byId('form-login') },
    register: { btn: byId('tab-register'), pane: byId('form-register') },
  };
  Object.entries(tabs).forEach(([key, { btn, pane }]) => {
    const active = key === which;
    btn?.classList.toggle('auth-tab--active', active);
    btn?.setAttribute('aria-selected', active ? 'true' : 'false');
    pane?.classList.toggle('hidden', !active);
  });
  hideMsg(which === 'login' ? 'login-msg' : 'reg-msg');
  byId(which === 'login' ? 'login-email' : 'reg-name')?.focus();
}

function initLoginSubmit() {
  byId('form-login-real')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMsg('login-msg');

    const email = byId('login-email').value.trim();
    const pwd = byId('login-pwd').value;
    const btn = byId('login-btn');

    if (!email || !pwd) {
      showMsg('login-msg', 'Completá todos los campos', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Ingresando…';

    await sleep(400);

    const token = 'mock_' + Date.now();
    const user = { name: email.split('@')[0], email, role: 'user' };
    ss.set(TOKEN_KEY, token);
    ss.set(USER_KEY, user);

    btn.textContent = '✓ Redirigiendo…';
    window.location.replace(HOME);
  });
}

function initRegisterSubmit() {
  byId('form-register-real')?.addEventListener('submit', (e) => {
    e.preventDefault();
    hideMsg('reg-msg');

    const name = byId('reg-name').value.trim();
    const email = byId('reg-email').value.trim();
    const pwd = byId('reg-pwd').value;

    if (!email || !pwd) {
      showMsg('reg-msg', 'Completá todos los campos', 'error');
      return;
    }
    if (pwd.length < 8) {
      showMsg('reg-msg', 'La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    showMsg('reg-msg', '✓ Cuenta creada. Pendiente de aprobación del admin.', 'success');
    byId('reg-name').value = '';
    byId('reg-email').value = '';
    byId('reg-pwd').value = '';
  });
}

function showMsg(id, text, type) {
  const el = byId(id);
  if (!el) return;
  el.textContent = text;
  el.className = `auth-msg auth-msg--${type}`;
  el.classList.remove('hidden');
}

function hideMsg(id) {
  const el = byId(id);
  if (el) el.classList.add('hidden');
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

document.addEventListener('DOMContentLoaded', initLogin);
