/* ============================================================
   storage.js — Wrapper de localStorage y sessionStorage
   ============================================================
   Single responsibility: persistir strings JSON. NADA MÁS.
   Sin auth, sin state, sin nada más.
*/

const safeParse = (str, fallback) => {
  if (str === null || str === undefined) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
};

const safeStringify = (value) => {
  try { return JSON.stringify(value); } catch { return null; }
};

const wrap = (storage) => ({
  get(key, fallback = null) {
    try { return safeParse(storage.getItem(key), fallback); }
    catch { return fallback; }
  },
  set(key, value) {
    const str = safeStringify(value);
    if (str === null) return false;
    try { storage.setItem(key, str); return true; }
    catch { return false; }
  },
  remove(key) {
    try { storage.removeItem(key); } catch {}
  },
  has(key) {
    try { return storage.getItem(key) !== null; }
    catch { return false; }
  },
});

export const ls = wrap(localStorage);
export const ss = wrap(sessionStorage);
