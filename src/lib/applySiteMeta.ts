import type { SiteMeta } from './siteMeta'
import { getMetaTags } from './siteMeta'

function setMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attr}="${key}"]`
  let el = document.querySelector(selector)

  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }

  el.setAttribute('content', content)
}

export function applySiteMeta(meta: SiteMeta, baseUrl?: string): void {
  document.title = meta.title

  for (const tag of getMetaTags(meta, baseUrl)) {
    setMetaTag(tag.attr, tag.key, tag.content)
  }
}

export type { SiteMeta } from './siteMeta'
