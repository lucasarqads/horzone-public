import imgMigatelie from '../assets/projetos/migatelie.webp'
import imgKtraca from '../assets/projetos/ktraca.webp'
import imgBeiracu from '../assets/projetos/beiracu.webp'

/**
 * Repertório.
 * Nunca inventar clientes ou números. Mídia: substituir `media` por import de imagem/vídeo quando houver.
 */

export type Projeto = {
  titulo: string
  /** o que o projeto é (ex.: 'Gerenciador de eventos') — aparece abaixo do título no carrossel de Tecnologia */
  tipo?: string
  cliente: string
  resultado?: string
  media?: string
  /** o que o cliente faz (ramo/atividade) — aparece no carrossel de anúncios */
  atuacao?: string
  /** texto do painel de descrição do projeto (nos anúncios não aparece no site) */
  descricao?: string
  link?: string
  /** perfil do cliente no Instagram (URL) — ícone clicável na janela do anúncio */
  instagram?: string
  /** números reais do anúncio/projeto (ex.: insights do Instagram) — guardados, não aparecem no site */
  metricas?: { rotulo: string; valor: string }[]
}

/** Etapa do funil AIDA */
export type Etapa = { letra: string; nome: string; descricao: string }

export type Bloco = {
  id: string
  titulo: string
  descricao: string
} & ({ exibicao: 'carrossel' | 'anuncios'; projetos: Projeto[] } | { exibicao: 'funil'; etapas: Etapa[] })

export const BLOCOS: Bloco[] = [
  {
    id: 'tecnologia',
    titulo: 'Tecnologia',
    descricao: 'Sites personalizados e automações que vendem e gerencia seu negócio.',
    exibicao: 'carrossel',
    // carrossel com parallax (o 1º começa no centro). Capas em assets/projetos.
    projetos: [
      {
        titulo: 'Migateliê',
        tipo: 'Site e-commerce',
        cliente: 'Natalia — Migateliê',
        media: imgMigatelie,
        descricao:
          'Página de biocommerce: apresenta a marca e reúne produtos e serviços em um só lugar.',
        link: 'https://migatelie.onrender.com/',
      },
      {
        titulo: 'Ktraca',
        tipo: 'Gerenciador de eventos',
        cliente: 'Ktraca',
        media: imgKtraca,
        descricao:
          'Gerenciador de eventos sob medida: uma área do organizador com acesso por login, de onde a equipe controla a entrada dos convidados do evento.',
        link: 'https://ktraca.onrender.com/',
      },
      {
        titulo: 'Beiracu',
        tipo: 'Loja virtual',
        cliente: 'Beiracu',
        media: imgBeiracu,
        descricao:
          'Loja virtual de moda minimalista: roupas femininas e masculinas, calçados e acessórios, com vitrine por categoria, coleções e sacola de compras.',
        link: 'https://beiracu.onrender.com/',
      },
    ],
  },
  {
    id: 'marketing-digital',
    titulo: 'Marketing digital',
    descricao: 'Posicionamento, conteúdo e funil para transformar atenção em demanda.',
    exibicao: 'funil',
    etapas: [
      { letra: 'A', nome: 'Atenção', descricao: 'Ser visto por quem importa: marca forte e presença onde o seu público já está.' },
      { letra: 'I', nome: 'Interesse', descricao: 'Prender a atenção com conteúdo útil e relevante, que faz a pessoa querer saber mais.' },
      { letra: 'D', nome: 'Desejo', descricao: 'Transformar interesse em vontade com a estratégia certa e um relacionamento constante.' },
      { letra: 'A', nome: 'Ação', descricao: 'Levar ao clique, ao contato e à venda — com um funil desenhado para converter.' },
    ],
  },
  {
    id: 'anuncio-trafego',
    titulo: 'Gravação de anúncio + tráfego',
    descricao: 'Do roteiro à campanha no ar: Gravações de videos que conectam você com seus clientes.',
    exibicao: 'anuncios',
    // só anúncios com vídeo real (arquivos em /public)
    projetos: [
      {
        titulo: 'Dra. Débora Reis',
        cliente: 'Dra. Débora Reis',
        atuacao: 'Odontologia',
        resultado: '11,5 mil visualizações',
        media: '/debora.mp4',
        instagram: 'https://www.instagram.com/dradeborareisc/',
        // insights do Instagram enviados pelo cliente
        descricao:
          'Reels mostrando o atendimento da Dra. Débora Reis, pensado para chegar a novos pacientes: 98,9% das visualizações e 92,6% das interações vieram de quem ainda não seguia o perfil. O vídeo foi salvo 41 vezes, compartilhado 13 e trouxe 10 novos seguidores.',
        metricas: [
          { rotulo: 'Visualizações', valor: '11.520' },
          { rotulo: 'Contas alcançadas', valor: '6.785' },
          { rotulo: 'Não seguidores', valor: '98,9%' },
          { rotulo: 'Interações', valor: '92' },
          { rotulo: 'Curtidas', valor: '35' },
          { rotulo: 'Salvamentos', valor: '41' },
          { rotulo: 'Compartilhamentos', valor: '13' },
          { rotulo: 'Contas com engajamento', valor: '62' },
          { rotulo: 'Novos seguidores', valor: '10' },
        ],
      },
      { titulo: 'Pense na Caixa', cliente: 'Pense na Caixa', atuacao: 'Experiências digitais', media: '/pensenacaixa.mp4', instagram: 'https://www.instagram.com/alouiseandrade/' },
      {
        titulo: 'Migateliê',
        cliente: 'Migateliê',
        atuacao: 'Beleza e Estética',
        resultado: '19,3 mil visualizações',
        media: '/atelie.mp4',
        instagram: 'https://www.instagram.com/nataliamedeiros/',
        // insights do Instagram enviados pelo cliente
        descricao:
          'Reels de Brow Lamination criado para alcançar público novo: 98,6% das visualizações e 91,9% das interações vieram de quem ainda não seguia o perfil. O conteúdo foi salvo 133 vezes e compartilhado 87 — sinais de que o vídeo foi útil e circulou além da base.',
        metricas: [
          { rotulo: 'Visualizações', valor: '19.301' },
          { rotulo: 'Contas alcançadas', valor: '8.809' },
          { rotulo: 'Não seguidores', valor: '98,6%' },
          { rotulo: 'Interações', valor: '432' },
          { rotulo: 'Curtidas', valor: '212' },
          { rotulo: 'Salvamentos', valor: '133' },
          { rotulo: 'Compartilhamentos', valor: '87' },
          { rotulo: 'Contas com engajamento', valor: '264' },
          { rotulo: 'Novos seguidores', valor: '28' },
        ],
      },
    ],
  },
]
