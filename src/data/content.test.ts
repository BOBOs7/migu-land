import { describe, expect, it } from 'vitest'
import { siteContent } from './content'
import {
  getSortedCaseStudies,
  groupCaseStudiesByCategory,
  validateCaseStudy,
  validateSiteContent,
} from './validate'

describe('siteContent', () => {
  it('passes structural validation', () => {
    expect(validateSiteContent(siteContent)).toEqual([])
  })

  it('has 7 case studies sorted by sortOrder', () => {
    const sorted = getSortedCaseStudies(siteContent.caseStudies)
    expect(sorted).toHaveLength(7)
    expect(sorted.map((c) => c.id)).toEqual([
      'space-nation',
      'higame',
      'guru-cafe',
      'bird-voyage',
      'tetris-factory',
      'dream-connection',
      'reika',
    ])
  })

  it('groups case studies by category', () => {
    const groups = groupCaseStudiesByCategory(siteContent.caseStudies)
    expect(groups.work).toHaveLength(2)
    expect(groups.personal).toHaveLength(5)
  })

  it('marks nda projects as desensitized', () => {
    const nda = siteContent.caseStudies.find((c) => c.status === 'nda')
    expect(nda?.desensitized).toBe(true)
    expect(validateCaseStudy(nda!)).toEqual([])
  })

  it('requires email on contact', () => {
    const broken = {
      ...siteContent,
      contact: { ...siteContent.contact, email: '' },
    }
    expect(validateSiteContent(broken)).toContain('contact.email must be a valid email')
  })
})
