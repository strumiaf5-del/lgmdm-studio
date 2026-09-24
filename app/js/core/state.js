/* ============================================================
   state.js — Store global con subscribe pattern
   ============================================================
   Single responsibility: guardar valores y notificar a listeners.
   NADA MÁS. Sin DOM, sin fetch, sin storage, sin nada más.

   API:
     get(key)                 → valor actual
     set(key, value)          → guarda + notifica listeners
     subscribe(key, fn)       → registra listener, retorna unsubscribe()
*/

const _state = {};
const _listeners = new Map();

export function get(key) {
  return _state[key];
}

export function set(key, value) {
  _state[key] = value;
  notify(key, value);
}

export function subscribe(key, fn) {
  if (!_listeners.has(key)) _listeners.set(key, new Set());
  _listeners.get(key).add(fn);
  return () => _listeners.get(key)?.delete(fn);
}

function notify(key, value) {
  const direct = _listeners.get(key);
  if (direct) direct.forEach(fn => fn(value));
  const wildcard = _listeners.get('*');
  if (wildcard) wildcard.forEach(fn => fn(key, value));
}
