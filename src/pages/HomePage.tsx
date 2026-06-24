import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { siteContent } from '../data'
import { HeroSection } from '../components/home/HeroSection'
import { StarBackground } from '../components/home/StarBackground'
import { SkillsContactSection } from '../components/home/SkillsContactSection'
import { WorksSection } from '../components/works/WorksSection'
import type { Lang } from '../data/types'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useHomeStepper } from '../hooks/useHomeStepper'

const phaseTransition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }

type HomePageProps = {
  lang: Lang
}

export function HomePage({ lang }: HomePageProps) {
  const total = siteContent.caseStudies.length
  const [modalOpen, setModalOpen] = useState(false)
  const {
    enabled,
    phase,
    activeIndex,
    enterHome,
    enterWorks,
    enterContact,
  } = useHomeStepper(total, modalOpen)

  useEffect(() => {
    document.documentElement.classList.add('home-active')
    return () => document.documentElement.classList.remove('home-active')
  }, [])

  useEffect(() => {
    const scrollToSection = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    const onNavigate = (event: Event) => {
      const target = (event as CustomEvent<{ target?: string }>).detail?.target
      if (enabled) {
        if (target === 'home') enterHome()
        if (target === 'project') enterWorks()
        if (target === 'contact') enterContact()
        return
      }

      if (target === 'home') scrollToSection('hero')
      if (target === 'project') scrollToSection('works')
      if (target === 'contact') scrollToSection('skills')
    }

    window.addEventListener('home:navigate', onNavigate)
    return () => window.removeEventListener('home:navigate', onNavigate)
  }, [enabled, enterHome, enterWorks, enterContact])

  useEffect(() => {
    const target =
      phase === 'hero' ? 'home' : phase === 'works' ? 'project' : 'contact'

    window.dispatchEvent(
      new CustomEvent('home:active-nav', { detail: { target } }),
    )
  }, [phase])

  // 开屏 / 作品阶段锁定原生滚动；末项后释放，outro 由原生滚动接管
  useBodyScrollLock(enabled && phase !== 'outro')

  // phase 切换兜底：works → outro 时主动滚到 outro 起点（占位高度 = 100dvh）；
  // outro → works/hero 时把页面复位到顶部，避免被 fixed 舞台覆盖时停在 outro 中段。
  const prevPhaseRef = useRef(phase)
  useEffect(() => {
    if (!enabled) return
    const prev = prevPhaseRef.current
    prevPhaseRef.current = phase
    if (prev === phase) return
    if (phase === 'outro') {
      requestAnimationFrame(() => {
        if (window.scrollY < window.innerHeight - 16) {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
        }
      })
    } else {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0 })
      })
    }
  }, [enabled, phase])

  // 用于跨阶段入场动画判断：
  // - wasOutroRef：从 outro 回到 stage 时，让 stage 从顶部下滑覆盖（C→B 视觉上 outro 向下消失）
  // - hasNavigatedRef：B→A 时让 hero 从下方滑入；首次加载 hero 不动画
  const wasOutroRef = useRef(false)
  const hasNavigatedRef = useRef(false)
  useEffect(() => {
    if (phase === 'outro') wasOutroRef.current = true
    if (phase !== 'hero') hasNavigatedRef.current = true
  }, [phase])

  // 降级：reduced-motion 时走普通可滚动文档
  if (!enabled) {
    return (
      <main className="relative">
        <StarBackground />
        <section className="relative z-10 min-h-[100dvh] border-b border-line">
          <HeroSection profile={siteContent.profile} lang={lang} />
        </section>
        <section className="relative z-10 border-b border-line py-24 md:py-32">
          <div className="mx-auto max-w-content px-6">
            <WorksSection
              caseStudies={siteContent.caseStudies}
              lang={lang}
              activeIndex={0}
              reduced
              onModalOpenChange={setModalOpen}
            />
          </div>
        </section>
        <section className="relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-content px-6">
            <SkillsContactSection
              intro={siteContent.skillsIntro}
              skills={siteContent.skills}
              contact={siteContent.contact}
              lang={lang}
            />
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="relative">
      <StarBackground />
      {/* 舞台占位：保证 body 有 100dvh 高度，便于末项后原生滚动滚出 outro */}
      <div aria-hidden className="h-[100dvh]" />

      {/* outro：始终在文档流末端，舞台覆盖在其之上；末项后释放钉住即可滚到此处 */}
      <section className="relative z-10 pt-12 md:pt-16">
        <div className="mx-auto max-w-content px-6 pb-24 md:pb-32">
          <SkillsContactSection
            intro={siteContent.skillsIntro}
            skills={siteContent.skills}
            contact={siteContent.contact}
            lang={lang}
          />
        </div>
      </section>

      <AnimatePresence>
        {phase !== 'outro' && (
          <motion.div
            key="stage"
            className="fixed inset-0 z-10 overflow-hidden"
            initial={wasOutroRef.current ? { y: '-100%' } : false}
            animate={{ y: 0 }}
            exit={{ opacity: 0 }}
            transition={phaseTransition}
          >
            <AnimatePresence mode="wait">
              {phase === 'hero' ? (
                <motion.div
                  key="hero"
                  className="h-full"
                  initial={
                    hasNavigatedRef.current ? { opacity: 0, y: 48 } : false
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -48 }}
                  transition={phaseTransition}
                >
                  <HeroSection
                    profile={siteContent.profile}
                    lang={lang}
                    onEnterWorks={enterWorks}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="works"
                  className="h-full"
                  initial={{ opacity: 0, y: 48 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={phaseTransition}
                >
                  <WorksSection
                    caseStudies={siteContent.caseStudies}
                    lang={lang}
                    activeIndex={activeIndex}
                    reduced={false}
                    onModalOpenChange={setModalOpen}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
