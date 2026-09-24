/* ============================================================
   api.js — HTTP fetch wrapper
   ============================================================
   Single responsibility: hacer fetch con auth headers, parsear JSON,
   timeout y logging. Sin lógica de features, sin UI, sin nada más.
*/

import { ss } from './storage.js';

const BASE_PATH = '/api';
const DEFAULT_TIMEOUT_MS = 30000;

function fullUrl(path) {
  return path.startsWith('/') ? path : `${BASE_PATH}${path}`;
}

function buildHeaders(extra = {}) {
  const headers = { ...extra };
  const isFormData = extra.body instanceof FormData;
  if (!headers['Content-Type'] && extra.body && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const token = ss.get('master_auth_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiFetch(path, options = {}) {
  const url = fullUrl(path);
  const opts = { ...options, headers: buildHeaders(options.headers || {}) };

  const controller = new AbortController();
  opts.signal = controller.signal;
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(url, opts);
    clearTimeout(timer);
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      console.warn(`[api] timeout after ${DEFAULT_TIMEOUT_MS}ms: ${path}`);
      throw new Error(`timeout: request took longer than ${DEFAULT_TIMEOUT_MS}ms`);
    }
    console.warn(`[api] network error: ${path}`, err.message);
    throw new Error(`network: ${err.message}`);
  }

  const text = await res.text().catch(() => '');
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const detail = data?.detail || text || res.statusText;
    console.warn(`[api] HTTP ${res.status}: ${path}`, detail);
    throw new Error(`${res.status}: ${detail}`);
  }

  return data;
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return null; }
}
