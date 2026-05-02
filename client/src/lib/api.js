/**
 * API base URL. Empty string uses Vite dev proxy (see vite.config.js).
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? ""

function url(path) {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE}${p}`
}

export async function apiGet(path) {
  const res = await fetch(url(path))
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export async function apiPost(path, body) {
  const res = await fetch(url(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export async function apiPut(path, body) {
  const res = await fetch(url(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export async function apiDelete(path) {
  const res = await fetch(url(path), { method: "DELETE" })
  if (!res.ok && res.status !== 204) throw new Error(`${res.status} ${res.statusText}`)
}
