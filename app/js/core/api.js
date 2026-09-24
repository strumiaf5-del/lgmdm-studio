/* ============================================================
   api.js — HTTP fetch wrapper
   ============================================================
   Single responsibility: hacer fetch con auth headers y parsear JSON.
   Sin lógica de features, sin UI, sin nada más.
*/

import { ss } from './storage.js';

const BASE_PATH = '/api';

function fullUrl(path) {
  return path.startsWith('/') ? path : `${BASE_PATH}${path}`;
}

function buildHeaders(extra = {}) {
  const headers = { ...extra };
  if (!headers['Content-Type'] && extra.body) {
    headers['Content-Type'] = 'application/json';
  }
  const token = ss.get('master_auth_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiFetch(path, options = {}) {
  const url = fullUrl(path);
  const opts = { ...options, headers: buildHeaders(options.headers || {}) };

  let res;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    throw new Error(`network: ${err.message}`);
  }

  const text = await res.text().catch(() => '');
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const detail = data?.detail || text || res.statusText;
    throw new Error(`${res.status}: ${detail}`);
  }

  return data;
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return null; }
}
