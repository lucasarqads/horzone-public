import capaTecnologia from '../assets/adicionais/kit-tecnologia-descomplicada.webp'
import { linkWhatsapp } from './contato'

/**
 * Adicionais — cursos e e-books. Troque os marcadores [ ] pelos dados reais.
 * `capa` (opcional): imagem da capa; sem ela, a capa é desenhada pelo site (livro / miniatura de vídeo).
 * `capaFundo` (opcional): mostra a capa INTEIRA (sem cortar) sobre essa cor — útil p/ capas quadradas.
 * `link`: página de venda ou checkout (enquanto não houver, abre o WhatsApp/e-mail de contato).
 */
export type Adicional = {
  tipo: 'curso' | 'ebook'
  titulo: string
  descricao: string
  detalhe: string // ex.: "12 aulas · 4h" ou "48 páginas · PDF"
  preco: string
  link: string
  capa?: string
  capaFundo?: string
  /** ainda não lançado: capa "Disponível em breve" e botão "Quero ser avisado" */
  emBreve?: boolean
}

export const ADICIONAIS: Adicional[] = [
  {
    tipo: 'ebook',
    titulo: 'Tecnologia Descomplicada',
    descricao:
      'Entenda de uma vez como a tecnologia funciona, de onde surge a internet até o funcionamento no seu aparelho. São 11 guias ilustrados diretos e fáceis de ler.',
    detalhe: 'Kit digital · 11 guias em PDF',
    preco: 'R$ 15,00',
    link: 'https://go.hotmart.com/H108527963F',
    capa: capaTecnologia,
    capaFundo: '#0b1220',
  },
  {
    tipo: 'curso',
    titulo: 'Curso de Videomaker',
    descricao:
      'Aprenda a gravar e editar vídeos que valorizam o seu trabalho — do roteiro e da captação à edição final de Reels e anúncios.',
    detalhe: 'Curso online · lançamento em breve',
    preco: 'Em breve',
    link: linkWhatsapp(),
    emBreve: true,
  },
  {
    tipo: 'curso',
    titulo: 'Curso de Posicionamento Digital',
    descricao:
      'Aprenda a definir sua mensagem, organizar seu perfil e criar conteúdo com estratégia para ser lembrado e escolhido pelo público certo nas redes.',
    detalhe: 'Curso online · lançamento em breve',
    preco: 'Em breve',
    link: linkWhatsapp(),
    emBreve: true,
  },
]
