import type { SiteContent } from '../data/types'

export type SiteMeta = SiteContent['meta']

type MetaTag = {
  attr: 'name' | 'property'
  key: string
  content: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

export function resolveOgImageUrl(ogImage: string, baseUrl?: string): string {
  if (/^https?:\/\//i.test(ogImage)) return ogImage

  const base = baseUrl?.replace(/\/$/, '') ?? ''
  if (!base) return ogImage

  const path = ogImage.startsWith('/') ? ogImage : `/${ogImage}`
  return `${base}${path}`
}

export function getMetaTags(meta: SiteMeta, baseUrl?: string): MetaTag[] {
  const ogImage = resolveOgImageUrl(meta.ogImage, baseUrl)

  return [
    { attr: 'name', key: 'description', content: meta.description },
    { attr: 'property', key: 'og:title', content: meta.title },
    { attr: 'property', key: 'og:description', content: meta.description },
    { attr: 'property', key: 'og:image', content: ogImage },
    { attr: 'property', key: 'og:type', content: 'website' },
    { attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
    { attr: 'name', key: 'twitter:title', content: meta.title },
    { attr: 'name', key: 'twitter:description', content: meta.description },
    { attr: 'name', key: 'twitter:image', content: ogImage },
  ]
}

export function buildMetaTagsHtml(meta: SiteMeta, baseUrl?: string): string {
  const tags = getMetaTags(meta, baseUrl)
  const title = `<title>${escapeHtml(meta.title)}</title>`
  const metas = tags
    .map((tag) => `<meta ${tag.attr}="${tag.key}" content="${escapeHtml(tag.content)}" />`)
    .join('\n    ')

  return `${title}\n    ${metas}`
}
