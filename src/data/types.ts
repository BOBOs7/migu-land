export type Lang = 'zh' | 'en'

export type LocalizedString = {
  zh: string
  en: string
}

export type CaseStatus = 'released' | 'nda' | 'competition' | 'personal'

export type ProjectCategory = 'work' | 'personal'

export type NavItem = {
  id: string
  label: LocalizedString
  path: string
}

export type Profile = {
  name: LocalizedString
  nameEn: string
  tagline: LocalizedString
  tags: LocalizedString[]
  avatarSrc: string
}

export type GalleryImage = {
  src: string
  alt: LocalizedString
}

export type MediaItem =
  | { kind: 'image'; src: string; alt: LocalizedString }
  | { kind: 'video'; mp4: string; webm?: string; alt: LocalizedString }

export type ModalBlock =
  | { type: 'heading'; text: LocalizedString }
  | { type: 'paragraph'; text: LocalizedString }
  | { type: 'list'; title?: LocalizedString; items: LocalizedString[] }
  | { type: 'image'; src: string; alt: LocalizedString }
  | { type: 'video'; url: string; caption?: LocalizedString }
  | { type: 'gallery'; images: GalleryImage[] }
  | {
      type: 'mediaGrid'
      layout: 'row' | 'grid'
      cols?: number
      pixelArt?: boolean
      title?: LocalizedString
      items: MediaItem[]
    }
  | {
      type: 'download'
      href: string
      label: LocalizedString
      hint?: LocalizedString
    }

export type CaseStudy = {
  id: string
  category: ProjectCategory
  title: LocalizedString
  tagLabel: LocalizedString
  status: CaseStatus
  cardIntro: LocalizedString
  coverSrc: string
  subtitle?: LocalizedString
  engine: LocalizedString
  platform: LocalizedString
  period?: string
  /** 展示用年份（项目块右侧显示） */
  year: string
  /** 弹窗头部「职责」 */
  role: LocalizedString
  modalBlocks: ModalBlock[]
  externalUrl?: string
  desensitized: boolean
  sortOrder: number
}

export type SkillGroup = {
  id: string
  title: LocalizedString
  items: Array<string | LocalizedString>
}

export type Contact = {
  email: string
}

export type SiteContent = {
  profile: Profile
  nav: NavItem[]
  caseStudies: CaseStudy[]
  skillsIntro: LocalizedString
  skills: SkillGroup[]
  contact: Contact
  meta: {
    title: string
    description: string
    ogImage: string
  }
}
