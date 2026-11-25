import { EMAIL } from './contato'

/**
 * Termos de Uso da Horzone — página /termos.html.
 * Dados da empresa, foro e prazos já preenchidos.
 * Recomendado: revisão por um advogado antes de publicar.
 */

export const TERMOS_ATUALIZACAO = '21 de novembro de 2026'

export type SecaoTermos = { id: string; titulo: string; paragrafos?: string[]; itens?: string[] }

export const TERMOS: SecaoTermos[] = [
  {
    id: 'aceitacao',
    titulo: 'Aceitação dos termos',
    paragrafos: [
      'Estes Termos de Uso regulam o acesso ao site da Horzone e a contratação dos nossos serviços e produtos digitais. Ao navegar pelo site, solicitar um orçamento, contratar um serviço ou adquirir um curso ou e-book, você declara que leu, entendeu e concorda com estas condições.',
      'Quando houver uma proposta comercial ou contrato específico assinado entre as partes, as condições desse documento prevalecem sobre estes Termos naquilo em que forem diferentes.',
    ],
  },
  {
    id: 'sobre',
    titulo: 'Quem somos',
    paragrafos: [
      `A Horzone Tecnologia (inscrita no CNPJ sob o nº 65.625.187/0001-64) presta serviços de desenvolvimento web, marketing digital e produção audiovisual. Contato: ${EMAIL}.`,
    ],
  },
  {
    id: 'servicos',
    titulo: 'Serviços oferecidos',
    paragrafos: ['A Horzone oferece, de forma isolada ou combinada:'],
    itens: [
      'Sites e sistemas: sites institucionais, páginas de vendas e de link na bio, lojas virtuais, sistemas web sob medida, painéis e automações.',
      'Marketing digital: posicionamento de marca, estratégia de conteúdo, funis de venda e gestão de redes sociais.',
      'Gravação de anúncios e tráfego pago: roteiro, captação e edição de vídeos para anúncios e redes sociais, além da criação, gestão e otimização de campanhas pagas.',
      'Cursos e e-books: materiais educativos em formato digital.',
    ],
  },
  {
    id: 'contratacao',
    titulo: 'Contratação e escopo',
    paragrafos: [
      'Cada serviço é contratado a partir de uma proposta ou orçamento que descreve o escopo, os entregáveis, os prazos, a quantidade de ajustes incluída e os valores. O trabalho começa após o aceite da proposta e a confirmação do pagamento inicial, quando houver.',
      'Pedidos que fujam do escopo aprovado — novas páginas, funcionalidades, vídeos ou campanhas — serão orçados à parte antes de qualquer execução.',
    ],
  },
  {
    id: 'pagamento',
    titulo: 'Valores e pagamento',
    paragrafos: [
      'Os valores, a forma de pagamento e as possibilidades de parcelamento são os informados na proposta ou no site no momento da contratação. Serviços recorrentes, como hospedagem e suporte, são cobrados mensalmente enquanto o serviço estiver ativo.',
      'Em caso de atraso, a Horzone poderá, após aviso prévio ao cliente, suspender os serviços recorrentes até a regularização. A suspensão não gera perda dos dados do cliente durante o período informado no aviso.',
    ],
  },
  {
    id: 'cliente',
    titulo: 'Responsabilidades do cliente',
    itens: [
      'Fornecer, nos prazos combinados, as informações, textos, imagens, logotipos, acessos e aprovações necessários ao projeto. Atrasos nessas entregas prorrogam os prazos da Horzone pelo mesmo período.',
      'Garantir que possui os direitos de uso de todo material enviado (textos, imagens, marcas, músicas) e que ele não viola direitos de terceiros nem a legislação.',
      'Manter a confidencialidade das senhas e acessos recebidos e informar a Horzone sobre qualquer uso indevido.',
      'Revisar e aprovar as entregas. Após a aprovação final, novos ajustes podem ser cobrados à parte.',
    ],
  },
  {
    id: 'sites',
    titulo: 'Sites e sistemas',
    itens: [
      'A mensalidade de hospedagem e suporte cobre a manutenção do site ou sistema no ar, a correção de falhas do que foi entregue e pequenos ajustes de conteúdo. Novas funcionalidades e mudanças de layout são orçadas à parte.',
      'O registro e a renovação do domínio (endereço do site) ficam em nome do cliente e sob sua responsabilidade, salvo acordo diferente.',
      'A Horzone emprega boas práticas para manter os serviços disponíveis e seguros, mas não garante funcionamento ininterrupto, já que podem ocorrer instabilidades em provedores de hospedagem, plataformas e serviços de terceiros fora do nosso controle.',
      'Ao encerrar a hospedagem com a Horzone, o cliente pode solicitar uma cópia dos arquivos e do conteúdo do seu site.',
    ],
  },
  {
    id: 'marketing',
    titulo: 'Marketing digital e tráfego pago',
    itens: [
      'O marketing e o tráfego pago envolvem fatores externos — concorrência, algoritmos das plataformas, sazonalidade e a própria oferta do cliente. Por isso, a Horzone se compromete com a boa execução do trabalho, mas não garante resultados específicos de alcance, vendas ou faturamento.',
      'A verba investida em anúncios é paga pelo cliente diretamente às plataformas (como Meta e Google) e é separada dos valores dos serviços da Horzone.',
      'As campanhas seguem as políticas de cada plataforma. Bloqueios, reprovações ou suspensões de contas decididos pelas plataformas não são de responsabilidade da Horzone, que ajudará o cliente a buscar a solução quando possível.',
    ],
  },
  {
    id: 'videos',
    titulo: 'Gravação de vídeos',
    itens: [
      'As gravações são agendadas com antecedência. Remarcações devem ser pedidas com pelo menos 48 horas de aviso; faltas ou cancelamentos sem esse aviso podem gerar cobrança de nova diária.',
      'O cliente é responsável por obter a autorização de uso de imagem das pessoas que aparecem nos vídeos e pela autorização do local de gravação, quando não for o seu próprio espaço.',
      'São entregues os vídeos editados conforme a proposta. Os arquivos brutos (sem edição) não fazem parte da entrega, salvo acordo diferente.',
      'Trilhas, fontes e elementos de terceiros usados nas edições seguem as licenças de cada fornecedor.',
    ],
  },
  {
    id: 'propriedade',
    titulo: 'Propriedade intelectual e portfólio',
    paragrafos: [
      'Após a quitação integral, o cliente pode usar livremente as entregas do seu projeto (site, artes e vídeos) para os fins combinados. Ferramentas, códigos e componentes reutilizáveis desenvolvidos pela Horzone continuam sendo de sua propriedade e podem ser usados em outros projetos.',
      'A Horzone pode exibir os trabalhos realizados e seus resultados em seu portfólio, site e redes sociais, exceto quando o cliente pedir sigilo por escrito.',
    ],
  },
  {
    id: 'cursos',
    titulo: 'Cursos e e-books',
    itens: [
      'A compra de um curso ou e-book dá ao comprador uma licença pessoal e intransferível de uso. Não é permitido copiar, revender, compartilhar ou distribuir o conteúdo, no todo ou em parte.',
      'As vendas podem ser processadas por plataformas parceiras (como a Hotmart), cujas regras de pagamento, entrega e acesso também se aplicam.',
      'Nas compras feitas pela internet, o consumidor pode desistir em até 7 dias a partir da compra ou do recebimento do acesso, com devolução do valor pago, conforme o artigo 49 do Código de Defesa do Consumidor.',
    ],
  },
  {
    id: 'cancelamento',
    titulo: 'Cancelamento',
    itens: [
      'Serviços recorrentes podem ser cancelados a qualquer momento, com aviso prévio de 30 dias, sem multa, salvo condição diferente na proposta.',
      'Em projetos com escopo fechado, o cancelamento após o início dos trabalhos dá direito à cobrança proporcional das etapas já executadas.',
      'Para contratações feitas a distância, fica garantido o direito de arrependimento em até 7 dias, nos termos do artigo 49 do Código de Defesa do Consumidor.',
    ],
  },
  {
    id: 'responsabilidade',
    titulo: 'Limitação de responsabilidade',
    paragrafos: [
      'A Horzone não se responsabiliza por danos causados por uso indevido das entregas pelo cliente, por conteúdos fornecidos pelo cliente, por falhas de serviços e plataformas de terceiros ou por eventos fora do seu controle razoável. Nada nestes Termos afasta direitos garantidos ao consumidor pela legislação.',
    ],
  },
  {
    id: 'dados',
    titulo: 'Privacidade e dados pessoais',
    paragrafos: [
      'Os dados pessoais recebidos pela Horzone — no contato pelo WhatsApp ou e-mail e durante a execução dos projetos — são usados apenas para responder, prestar os serviços contratados e cumprir obrigações legais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). O titular pode pedir acesso, correção ou exclusão dos seus dados pelos canais de contato abaixo. Os detalhes estão na nossa Política de Privacidade (/privacidade.html).',
    ],
  },
  {
    id: 'alteracoes',
    titulo: 'Alterações destes termos',
    paragrafos: [
      'Estes Termos podem ser atualizados a qualquer momento. A versão vigente é sempre a publicada nesta página, com a data da última atualização. Mudanças não alteram as condições de contratos já assinados.',
    ],
  },
  {
    id: 'foro',
    titulo: 'Legislação e foro',
    paragrafos: [
      'Estes Termos seguem as leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo/SP para resolver eventuais questões, ressalvado ao consumidor o direito de propor ação no foro do seu domicílio.',
    ],
  },
  {
    id: 'contato',
    titulo: 'Contato',
    paragrafos: [`Dúvidas sobre estes Termos podem ser enviadas para ${EMAIL} ou pelo nosso WhatsApp.`],
  },
]
