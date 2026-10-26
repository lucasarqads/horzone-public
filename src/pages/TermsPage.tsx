import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const termsSections = [
  {
    title: "1. Visão Geral e Objeto",
    paragraphs: [
      "A Horzone é uma plataforma de tecnologia e prestação de serviços de desenvolvimento web, responsável pela criação e hospedagem de vitrines digitais (BioWeb), sites institucionais, landing pages de alta conversão e sistemas web personalizados.",
    ],
  },
  {
    title: "2. Aceitação dos Termos",
    paragraphs: [
      "Ao contratar qualquer um dos planos (BioWeb Express, Horzone Pro ou Horzone Custom) ou utilizar nossos serviços, o contratante concorda integralmente com estes Termos e Condições.",
    ],
  },
  {
    title: "3. Responsabilidades e Conteúdo do Cliente",
    paragraphs: [
      "O cliente é integralmente responsável pela veracidade e legalidade das informações, imagens, textos e marcas fornecidas para inserção em seu site ou BioWeb.",
      "É estritamente proibida a utilização dos serviços da Horzone para veiculação de conteúdos ilícitos, fraudes, spam, produtos proibidos por lei ou violação de direitos autorais de terceiros.",
    ],
  },
  {
    title: "4. Planos, Pagamentos e Mensalidades (MRR)",
    paragraphs: [
      "Taxa de Implementação (Setup): O valor do desenvolvimento personalizado é acordado via proposta comercial e deve ser quitado de acordo com as condições negociadas (à vista ou parcelado).",
      "Manutenção e Hospedagem Recorrente: A manutenção da infraestrutura, certificado SSL e suporte é cobrada mensalmente conforme o plano contratado. Em caso de inadimplência superior a 15 dias, a exibição do site/plataforma poderá ser temporariamente suspensa.",
    ],
  },
  {
    title: "5. Propriedade Intelectual",
    paragraphs: [
      "O cliente detém todos os direitos sobre sua marca, logo, conteúdos autorais e dados de seus leads/clientes.",
      "A Horzone retém os direitos sobre os códigos-fonte base, frameworks internos, componentes proprietários e estruturas da plataforma utilizadas para a prestação do serviço.",
    ],
  },
  {
    title: "6. Disponibilidade de Serviço (SLA) e Integrações de Terceiros",
    paragraphs: [
      "A Horzone busca manter índice de disponibilidade (uptime) de 99,5% nos servidores de hospedagem.",
      "A Horzone não se responsabiliza por indisponibilidades temporárias causadas por APIs e serviços de terceiros (como WhatsApp/Meta, gateways de pagamento ou registradores de domínio).",
    ],
  },
  {
    title: "7. Cancelamento e Rescisão",
    paragraphs: [
      "O cliente pode solicitar o cancelamento da mensalidade de manutenção a qualquer momento com aviso prévio de 30 dias, sem multa rescisória, ficando ciente de que a hospedagem e suporte gerenciado serão descontinuados.",
    ],
  },
  {
    title: "8. Foro e Legislação Aplicável",
    paragraphs: [
      "Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o Foro da Comarca de São Paulo/SP para dirimir quaisquer dúvidas ou controvérsias.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-4 focus:ring-offset-slate-950"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar para a página inicial
        </Link>

        <header className="mt-14 border-b border-slate-800 pb-10">
          <span className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">
            Documentação legal
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            Termos e Condições Gerais de Uso
          </h1>
          <p className="mt-5 text-sm text-slate-400">
            Última atualização: 26 de Outubro de 2026
          </p>
        </header>

        <div className="divide-y divide-slate-800">
          {termsSections.map((section) => (
            <section key={section.title} className="py-9 first:pt-10">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-slate-300">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-indigo-400/25 bg-indigo-400/10 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white">Dúvidas sobre os nossos termos?</h2>
          <p className="mt-3 leading-7 text-slate-300">
            Entre em contato com nossa equipe jurídica através do e-mail{" "}
            <a
              href="mailto:horzonetecnologia@gmail.com"
              className="font-semibold text-indigo-300 underline decoration-indigo-400/50 underline-offset-4 transition hover:text-white"
            >
              horzonetecnologia@gmail.com
            </a>
            .
          </p>
        </section>

        <footer className="border-t border-slate-800 py-8 text-sm text-slate-500">
          © 2026 Horzone LTDA · CNPJ 65.625.187/0001-64 · São Paulo · Todos os
          direitos reservados.
        </footer>
      </div>
    </main>
  );
}
