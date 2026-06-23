import { t } from '../../i18n'
import type { Contact, LocalizedString, SkillGroup } from '../../data/types'

type SkillsContactSectionProps = {
  intro: LocalizedString
  skills: SkillGroup[]
  contact: Contact
}

export function SkillsContactSection({
  intro,
  skills,
  contact,
}: SkillsContactSectionProps) {
  return (
    <div className="space-y-20 md:space-y-28">
      <section id="skills">
        <header className="mb-10">
          <h2 className="font-display text-h2 text-ink">Skills</h2>
          <p className="mt-4 max-w-xl text-body text-ink-muted">{t(intro)}</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group) => (
            <div
              key={group.id}
              className="rounded-card border border-line bg-surface p-6"
            >
              <h3 className="text-lead text-ink">{t(group.title)}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-btn border border-line bg-background px-2.5 py-1 text-sm text-ink-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact">
        <header className="mb-8">
          <h2 className="font-display text-h2 text-ink">Contact</h2>
          <p className="mt-4 text-body text-ink-muted">
            Thanks for watching, welcome to contact me via email!
          </p>
        </header>

        <div className="rounded-card border border-line bg-surface p-8 md:p-10">
          <p className="text-caption text-ink-muted">邮箱</p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-2 block text-2xl font-semibold text-accent-strong underline-offset-4 hover:underline md:text-3xl"
          >
            {contact.email}
          </a>
        </div>
      </section>
    </div>
  )
}
