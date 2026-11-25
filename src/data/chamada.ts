import { linkWhatsapp } from './contato'

/** Chamada para ação — última seção, entre Adicionais e o rodapé. */
export const CHAMADA = {
  titulo: 'Vamos tirar o seu projeto do papel',
  descricao: 'Conte o que o seu negócio precisa e receba uma proposta sob medida, direto no WhatsApp.',
  botao: { rotulo: 'Falar no WhatsApp', href: linkWhatsapp() },
  secundario: { rotulo: 'Ver projetos', href: '#repertorio' },
}
