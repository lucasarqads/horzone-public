import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PaginaLegal } from './pages/PaginaLegal'
import { TERMOS, TERMOS_ATUALIZACAO } from './data/termos'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaginaLegal titulo="Termos de uso" atualizacao={TERMOS_ATUALIZACAO} secoes={TERMOS} />
  </StrictMode>,
)
