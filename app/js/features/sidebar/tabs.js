/* ============================================================
   tabs.js — Lógica de tabs del sidebar
   ============================================================
   Single responsibility: manejar clicks + keyboard navigation en
   .sidebar__tab y mostrar/ocultar los .sidebar__pane correspondientes.

   WAI-ARIA Tab Pattern:
     - Click: activa el tab
     - ArrowLeft / ArrowRight: navega entre tabs (ciclo)
     - Home: primer tab
     - End: último tab
*/

import { $$, byId } from '../../core/dom.js';

export function initSidebarTabs() {
  const tabs = $$('.sidebar__tab');
  if (tabs.length === 0) return;

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tabs, i));

    tab.addEventListener('keydown', (e) => {
      let next = i;
      if (e.key === 'ArrowLeft')  next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'Home')  next = 0;
      else if (e.key === 'End')   next = tabs.length - 1;
      else return;

      e.preventDefault();
      tabs[next].focus();
      activateTab(tabs, next);
    });
  });
}

function activateTab(tabs, activeIdx) {
  tabs.forEach((t, i) => {
    const active = i === activeIdx;
    t.classList.toggle('sidebar__tab--active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
    t.setAttribute('tabindex', active ? '0' : '-1');
  });

  $$('.sidebar__pane').forEach(p => p.setAttribute('hidden', ''));

  const targetId = tabs[activeIdx].dataset.pane;
  const target = byId(targetId);
  if (target) target.removeAttribute('hidden');
}
