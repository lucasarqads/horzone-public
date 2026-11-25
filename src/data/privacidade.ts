import { EMAIL } from './contato'
import type { SecaoTermos } from './termos'

/**
 * Política de Privacidade da Horzone — página /privacidade.html.
 * Escrita conforme o que o site faz HOJE: sem formulários, sem cookies próprios, sem analytics nem pixels.
 * Se isso mudar (ex.: instalar Google Analytics ou Pixel da Meta), atualize a seção "Cookies e rastreamento".
 * Recomendado: revisão por um advogado antes de publicar.
 */

export const PRIVACIDADE_ATUALIZACAO = '21 de novembro de 2026'

export const PRIVACIDADE: SecaoTermos[] = [
  {
    id: 'introducao',
    titulo: 'Introdução',
    paragrafos: [
      'Esta Política de Privacidade explica como a Horzone coleta, usa, armazena e protege os dados pessoais de quem visita o nosso site, entra em contato conosco ou contrata os nossos serviços de sites e sistemas, marketing digital e gravação de vídeos.',
      'Seguimos a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD) e tratamos apenas os dados necessários para atender você.',
    ],
  },
  {
    id: 'controlador',
    titulo: 'Quem é o responsável pelos dados',
    paragrafos: [
      `O controlador dos dados é a Horzone Tecnologia (CNPJ nº 65.625.187/0001-64). Para qualquer assunto relacionado a privacidade, fale conosco pelo e-mail ${EMAIL}.`,
    ],
  },
  {
    id: 'coleta',
    titulo: 'Quais dados coletamos',
    paragrafos: ['O site não possui formulários de cadastro. Recebemos dados pessoais apenas quando você nos procura ou contrata um serviço:'],
    itens: [
      'Contato: nome, telefone, e-mail e as informações que você nos envia pelo WhatsApp, e-mail ou redes sociais.',
      'Contratação: dados para emissão de proposta, contrato e cobrança, como nome ou razão social, CPF ou CNPJ e endereço.',
      'Projetos: textos, fotos, logotipos, acessos e demais materiais que você envia para a execução do serviço.',
      'Gravações: imagem e voz das pessoas que aparecem nos vídeos produzidos, mediante autorização.',
      'Navegação: dados técnicos registrados automaticamente pelos servidores de hospedagem, como endereço IP, data e hora de acesso, navegador e páginas visitadas.',
    ],
  },
  {
    id: 'uso',
    titulo: 'Para que usamos os dados',
    itens: [
      'Responder às suas mensagens, tirar dúvidas e enviar propostas.',
      'Executar os serviços contratados: desenvolver sites e sistemas, criar estratégias e campanhas e produzir vídeos.',
      'Emitir cobranças e cumprir obrigações legais, fiscais e contratuais.',
      'Manter o site funcionando com segurança e corrigir falhas.',
      'Exibir trabalhos no nosso portfólio, quando autorizado pelo cliente.',
    ],
  },
  {
    id: 'bases',
    titulo: 'Bases legais',
    paragrafos: [
      'Tratamos dados com base nas hipóteses previstas no artigo 7º da LGPD: execução de contrato e de procedimentos preliminares a ele (como o envio de propostas), cumprimento de obrigação legal ou regulatória, legítimo interesse (como a segurança do site) e consentimento, quando ele for necessário — por exemplo, para o uso de imagem em vídeos e no portfólio.',
    ],
  },
  {
    id: 'compartilhamento',
    titulo: 'Compartilhamento de dados',
    paragrafos: ['Não vendemos dados pessoais. Eles podem ser compartilhados somente quando necessário com:'],
    itens: [
      'Provedores de hospedagem e infraestrutura que mantêm o site e os sistemas no ar.',
      'Plataformas de anúncios e redes sociais (como Meta e Google), na execução de campanhas contratadas pelo cliente.',
      'Plataformas de pagamento e de venda de cursos e e-books (como a Hotmart), que seguem as próprias políticas de privacidade.',
      'Contabilidade e autoridades públicas, quando exigido por lei.',
    ],
  },
  {
    id: 'cookies',
    titulo: 'Cookies e rastreamento',
    paragrafos: [
      'O nosso site não usa cookies próprios, ferramentas de análise de audiência nem pixels de rastreamento de anúncios.',
      'Para exibir as fontes do site, a página carrega arquivos do Google Fonts, o que faz o seu navegador se conectar aos servidores do Google. Os links para WhatsApp, Instagram, Hotmart e sites de clientes levam a serviços de terceiros, que têm as próprias políticas de privacidade e de cookies.',
    ],
  },
  {
    id: 'armazenamento',
    titulo: 'Armazenamento e segurança',
    paragrafos: [
      'Adotamos medidas técnicas e administrativas razoáveis para proteger os dados contra acessos não autorizados, perda ou uso indevido, como acesso restrito às informações e uso de serviços com conexão segura. Nenhum sistema é totalmente imune a falhas; se ocorrer um incidente relevante, comunicaremos os afetados e a Autoridade Nacional de Proteção de Dados (ANPD), conforme a lei.',
      'Alguns dos nossos fornecedores podem armazenar dados em servidores fora do Brasil. Nesses casos, buscamos serviços que ofereçam um nível de proteção adequado, nos termos da LGPD.',
    ],
  },
  {
    id: 'retencao',
    titulo: 'Por quanto tempo guardamos os dados',
    paragrafos: [
      'Os dados são mantidos pelo tempo necessário para cumprir as finalidades descritas nesta política: durante o atendimento e a prestação do serviço e, depois disso, pelo prazo exigido por obrigações legais e fiscais ou para a defesa de direitos. Encerrados esses prazos, os dados são excluídos ou anonimizados.',
    ],
  },
  {
    id: 'direitos',
    titulo: 'Seus direitos',
    paragrafos: ['Como titular dos dados, você pode, a qualquer momento e gratuitamente:'],
    itens: [
      'Confirmar se tratamos dados seus e ter acesso a eles.',
      'Corrigir dados incompletos, inexatos ou desatualizados.',
      'Pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desacordo com a lei.',
      'Pedir a portabilidade dos seus dados a outro fornecedor.',
      'Saber com quem compartilhamos os seus dados.',
      'Revogar o consentimento dado e pedir a eliminação dos dados tratados com base nele.',
      'Apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).',
    ],
  },
  {
    id: 'exercer',
    titulo: 'Como exercer seus direitos',
    paragrafos: [
      `Envie o seu pedido para ${EMAIL} ou pelo nosso WhatsApp. Poderemos pedir informações para confirmar a sua identidade antes de atender, para proteger os seus próprios dados. Respondemos dentro dos prazos previstos na LGPD.`,
    ],
  },
  {
    id: 'menores',
    titulo: 'Crianças e adolescentes',
    paragrafos: [
      'Os nossos serviços são voltados a empresas e profissionais adultos. Não coletamos intencionalmente dados de crianças. A gravação de menores de idade em vídeos só acontece com a autorização dos pais ou responsáveis.',
    ],
  },
  {
    id: 'alteracoes',
    titulo: 'Alterações desta política',
    paragrafos: [
      'Esta política pode ser atualizada para refletir mudanças nos nossos serviços ou na legislação. A versão vigente é sempre a publicada nesta página, com a data da última atualização.',
    ],
  },
  {
    id: 'contato',
    titulo: 'Contato',
    paragrafos: [`Dúvidas sobre privacidade e proteção de dados podem ser enviadas para ${EMAIL} ou pelo nosso WhatsApp.`],
  },
]
