/// <reference types="node" />
/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { siteContent } from './src/data/content'
import { buildMetaTagsHtml } from './src/lib/siteMeta'

function injectSiteMetaPlugin(siteUrl: string): Plugin {
  return {
    name: 'inject-site-meta',
    transformIndexHtml(html) {
      const metaHtml = buildMetaTagsHtml(
        siteContent.meta,
        siteUrl || undefined,
      )

      const withoutMeta = html
        .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
        .replace(/<meta\s+name="description"[^>]*>\s*/i, '')
        .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '')
        .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, '')

      return withoutMeta.replace(
        /(<meta name="viewport"[^>]*>)/i,
        `$1\n    <!-- meta: src/data/content.ts (single source) -->\n    ${metaHtml}`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), injectSiteMetaPlugin(env.VITE_SITE_URL ?? '')],
    test: {
      globals: true,
      environment: 'node',
    },
  }
})
