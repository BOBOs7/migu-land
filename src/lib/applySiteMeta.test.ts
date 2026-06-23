import { describe, expect, it } from 'vitest'
import { buildMetaTagsHtml, getMetaTags, resolveOgImageUrl } from './siteMeta'
import { siteContent } from '../data/content'

describe('applySiteMeta', () => {
  it('meta fields in siteContent are non-empty', () => {
    expect(siteContent.meta.title.trim()).not.toBe('')
    expect(siteContent.meta.description.trim()).not.toBe('')
    expect(siteContent.meta.ogImage.trim()).not.toBe('')
  })

  it('resolveOgImageUrl keeps relative path without baseUrl', () => {
    expect(resolveOgImageUrl('/assets/cover/cover-sn.png')).toBe(
      '/assets/cover/cover-sn.png',
    )
  })

  it('resolveOgImageUrl builds absolute URL with baseUrl', () => {
    expect(
      resolveOgImageUrl('/assets/cover/cover-sn.png', 'https://example.com'),
    ).toBe('https://example.com/assets/cover/cover-sn.png')
  })

  it('buildMetaTagsHtml includes title and og tags from content.ts', () => {
    const html = buildMetaTagsHtml(siteContent.meta)
    expect(html).toContain(`<title>${siteContent.meta.title}</title>`)
    expect(html).toContain(`content="${siteContent.meta.description}"`)
    expect(html).toContain(`property="og:image" content="${siteContent.meta.ogImage}"`)
  })

  it('getMetaTags mirrors title and description for og and twitter', () => {
    const tags = getMetaTags(siteContent.meta)
    expect(tags.find((t) => t.key === 'og:title')?.content).toBe(siteContent.meta.title)
    expect(tags.find((t) => t.key === 'twitter:title')?.content).toBe(
      siteContent.meta.title,
    )
  })
})
