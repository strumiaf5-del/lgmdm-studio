/* ============================================================
   tabs.js — Lógica de tabs del sidebar
   ============================================================
   Single responsibility: manejar clicks en .sidebar__tab
   y mostrar/ocultar los .sidebar__pane correspondientes.
*/

import { $$, byId } from '../../core/dom.js';

export function initSidebarTabs() {
  const tabs = $$('.sidebar__tab');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.pane;
      activateTab(tab, targetId);
    });
  });
}

function activateTab(activeTab, targetId) {
  $$('.sidebar__tab').forEach(t => {
    t.classList.remove('sidebar__tab--active');
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });

  activeTab.classList.add('sidebar__tab--active');
  activeTab.setAttribute('aria-selected', 'true');
  activeTab.setAttribute('tabindex', '0');

  $$('.sidebar__pane').forEach(p => p.setAttribute('hidden', ''));

  const target = byId(targetId);
  if (target) target.removeAttribute('hidden');
}
