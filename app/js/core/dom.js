/* ============================================================
   dom.js — DOM query helpers
   ============================================================
   Single responsibility: query DOM. NADA MÁS.
   Sin eventos, sin state, sin nada más.
*/

export const $ = (selector, root = document) =>
  root.querySelector(selector);

export const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

export const byId = (id) =>
  document.getElementById(id);
