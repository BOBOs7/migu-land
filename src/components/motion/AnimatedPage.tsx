import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type AnimatedPageProps = {
  children: ReactNode
}

export function AnimatedPage({ children }: AnimatedPageProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="w-full"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        reduced
          ? undefined
          : { opacity: 0, transition: { duration: 0, ease: 'linear' } }
      }
      transition={{ duration: reduced ? 0 : 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
