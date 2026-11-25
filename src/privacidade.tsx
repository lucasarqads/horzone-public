import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PaginaLegal } from './pages/PaginaLegal'
import { PRIVACIDADE, PRIVACIDADE_ATUALIZACAO } from './data/privacidade'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaginaLegal titulo="Política de privacidade" atualizacao={PRIVACIDADE_ATUALIZACAO} secoes={PRIVACIDADE} />
  </StrictMode>,
)
