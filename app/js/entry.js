/* ============================================================
   entry.js — App bootstrap
   ============================================================
   Single responsibility: arrancar los features cuando DOM esté listo.
   Cada feature expone una función init() — entry NO contiene lógica propia.
*/

import { initSession } from './features/auth/session.js';
import { initSidebarTabs } from './features/sidebar/tabs.js';
import { initSidebarResize } from './features/sidebar/resize.js';
import { initThemeSwitcher } from './features/theme/switcher.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!initSession()) return; // no autenticado → redirigido a login
  initSidebarTabs();
  initSidebarResize();
  initThemeSwitcher();
  console.log('[LGMDM] Phase 2 ready: auth + sidebar + theme.');
});
