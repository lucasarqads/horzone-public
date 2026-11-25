import { linkWhatsapp } from './contato'

/**
 * Seção "Plano" (antes de Adicionais) — 1 card com benefícios e valores.
 * Valores informados pela Horzone. `prefixo` aparece pequeno antes do valor; `sufixo` logo depois.
 */
type Passo = { titulo: string; descricao: string }
type Valor = { rotulo: string; prefixo?: string; valor: string; sufixo?: string; detalhe: string }

export const PLANO: {
  rotulo: string
  selo: string
  titulo: string
  beneficios: string[]
  valores: Valor[]
  passos: Passo[]
  chamada: string
  link: string
} = {
  rotulo: 'Ecossistema Horzone',
  selo: 'Recomendado',
  titulo: 'Com a Horzone (Físico + Digital)',
  beneficios: [
    'Vitrine e captação de clientes rodando 24 horas por dia, 7 dias por semana',
    'Agendamentos e orçamentos qualificados de forma 100% automática',
    'Posicionamento de marca premium que transmite autoridade imediata',
    'Atendimento rápido sem deixar nenhum cliente esperando',
    'Leads organizados e prontos para o fechamento de vendas',
  ],
  valores: [
    { rotulo: 'Implantação', prefixo: 'A partir de', valor: 'R$ 350', detalhe: 'Parcelado em até 6x' },
    { rotulo: 'Mensalidade', valor: 'R$ 80', sufixo: '/mês', detalhe: 'Hospedagem + suporte' },
  ],
  // 3 passos para o cliente ter a estrutura dele (cards abaixo do título)
  passos: [
    {
      titulo: 'Fale com a gente',
      descricao: 'Conte sobre o seu negócio pelo WhatsApp. Entendemos seus objetivos e enviamos uma proposta sob medida.',
    },
    {
      titulo: 'Aprove e envie seus conteúdos',
      descricao: 'Aprove a proposta, faça o pagamento da implantação e envie logo, fotos e textos da sua marca.',
    },
    {
      titulo: 'Sua estrutura no ar',
      descricao: 'Desenvolvemos, você revisa e publicamos. Depois, seguimos com hospedagem e suporte todo mês.',
    },
  ],
  chamada: 'Quero meu ecossistema',
  link: linkWhatsapp(),
}
