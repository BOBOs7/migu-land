import type { Lang, LocalizedString } from './data/types'

export const defaultLang: Lang = 'en'

export function t(field: LocalizedString, lang: Lang = defaultLang): string {
  const value = field[lang]?.trim()
  return value || field.zh
}

export function loc(zh: string, en = ''): LocalizedString {
  return { zh, en }
}
