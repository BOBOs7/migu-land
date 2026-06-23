import type { CaseStatus, CaseStudy, SiteContent } from './types'

const REQUIRED_CASE_FIELDS = [
  'id',
  'title',
  'tagLabel',
  'status',
  'engine',
  'platform',
  'cardIntro',
  'coverSrc',
  'role',
  'desensitized',
] as const

const VALID_STATUSES: CaseStatus[] = ['released', 'nda', 'competition', 'personal']

export function validateSiteContent(content: SiteContent): string[] {
  const errors: string[] = []

  if (!content.profile.name.zh.trim()) {
    errors.push('profile.name is required')
  }
  if (!content.profile.tagline.zh.trim()) {
    errors.push('profile.tagline is required')
  }
  if (!content.profile.avatarSrc.trim()) {
    errors.push('profile.avatarSrc is required')
  }
  if (!content.profile.tags.length) {
    errors.push('profile.tags must not be empty')
  }

  if (!content.nav.length) {
    errors.push('nav must not be empty')
  }

  if (content.caseStudies.length !== 7) {
    errors.push(`caseStudies must have 7 items, got ${content.caseStudies.length}`)
  }

  for (const caseStudy of content.caseStudies) {
    errors.push(...validateCaseStudy(caseStudy))
  }

  if (!content.contact.email.includes('@')) {
    errors.push('contact.email must be a valid email')
  }

  return errors
}

export function validateCaseStudy(caseStudy: CaseStudy): string[] {
  const errors: string[] = []

  for (const field of REQUIRED_CASE_FIELDS) {
    const value = caseStudy[field]
    if (typeof value === 'string' && !value.trim()) {
      errors.push(`caseStudy.${caseStudy.id}.${field} is required`)
    }
    if (
      typeof value === 'object' &&
      value !== null &&
      'zh' in value &&
      !value.zh.trim()
    ) {
      errors.push(`caseStudy.${caseStudy.id}.${field}.zh is required`)
    }
  }

  if (!VALID_STATUSES.includes(caseStudy.status)) {
    errors.push(`caseStudy.${caseStudy.id}.status is invalid`)
  }

  if (caseStudy.status === 'nda' && !caseStudy.desensitized) {
    errors.push(`caseStudy.${caseStudy.id} with status nda must be desensitized`)
  }

  if (!caseStudy.modalBlocks.length) {
    errors.push(`caseStudy.${caseStudy.id} must have modalBlocks`)
  }

  if (!caseStudy.coverSrc.startsWith('/assets/cover/')) {
    errors.push(`caseStudy.${caseStudy.id}.coverSrc must be under /assets/cover/`)
  }

  return errors
}

export function getSortedCaseStudies(caseStudies: CaseStudy[]): CaseStudy[] {
  return [...caseStudies].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function groupCaseStudiesByCategory(caseStudies: CaseStudy[]) {
  const sorted = getSortedCaseStudies(caseStudies)
  return {
    work: sorted.filter((c) => c.category === 'work'),
    personal: sorted.filter((c) => c.category === 'personal'),
  }
}
