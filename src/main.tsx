import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { siteContent } from './data'
import { applySiteMeta } from './lib/applySiteMeta'
import { getSiteBaseUrl } from './lib/publicAsset'
import './index.css'

applySiteMeta(siteContent.meta, getSiteBaseUrl())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
