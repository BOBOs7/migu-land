/**
 * Resolve a public-folder path against Vite `base` (e.g. `/migu-land/` on GitHub Pages).
 */
export function publicAsset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path

  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${normalized}`
}

export function getSiteBaseUrl(): string {
  const base = import.meta.env.BASE_URL
  if (base === '/') return window.location.origin
  return `${window.location.origin}${base.replace(/\/$/, '')}`
}
