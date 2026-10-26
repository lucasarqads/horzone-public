import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const privacySections = [
  {
    title: "1. Compromisso com a sua Privacidade",
    paragraphs: [
      "A Horzone compromete-se com a transparência e a segurança dos dados pessoais de todos os utilizadores, clientes e visitantes das nossas plataformas e soluções web.",
    ],
  },
  {
    title: "2. Coleta de Dados Pessoais",
    paragraphs: [
      "Coletamos os dados fornecidos diretamente no formulário de contacto e qualificação de leads, como nome, e-mail, telefone/WhatsApp, nome da empresa e necessidades do projeto.",
      "Também coletamos dados automáticos de navegação, incluindo endereço IP, tipo de navegador e métricas de desempenho, para otimizar a experiência de utilização.",
    ],
  },
  {
    title: "3. Finalidade da Utilização dos Dados",
    paragraphs: [
      "Os dados recolhidos destinam-se exclusivamente a qualificar e responder a solicitações de orçamento; prestar os serviços contratados (BioWeb, Sites Institucionais e Sistemas Custom); enviar comunicações operacionais; e gerir a infraestrutura e o suporte contínuo.",
    ],
  },
  {
    title: "4. Compartilhamento e Subprocessadores",
    paragraphs: [
      "A Horzone não vende, aluga ou cede dados pessoais a terceiros. O compartilhamento ocorre estritamente com provedores de infraestrutura essenciais para a prestação do serviço, como servidores de alojamento/cloud, autoridades de emissão SSL e gateways de pagamento, sob rigorosos deveres de confidencialidade.",
    ],
  },
  {
    title: "5. Segurança da Informação",
    paragraphs: [
      "Adotamos medidas técnicas e organizativas rigorosas para proteger os seus dados, incluindo encriptação SSL/TLS, controlo de acessos restrito e monitorização contínua dos servidores.",
    ],
  },
  {
    title: "6. Seus Direitos enquanto Titular dos Dados (LGPD)",
    paragraphs: [
      "Nos termos do Art. 18 da LGPD, o utilizador tem o direito de confirmar a existência de tratamento, aceder aos seus dados, solicitar a correção de dados incompletos ou inexatos, requerer a eliminação ou revogar o consentimento a qualquer momento.",
    ],
  },
  {
    title: "7. Utilização de Cookies",
    paragraphs: [
      "Utilizamos apenas cookies essenciais para o correto funcionamento da plataforma e cookies analíticos para compreender o fluxo de navegação e melhorar a performance da landing page.",
    ],
  },
  {
    title: "8. Encarregado de Proteção de Dados (DPO) e Contacto",
    paragraphs: [
      "Para exercer os seus direitos de titular ou esclarecer qualquer questão sobre o tratamento de dados, entre em contacto com o nosso encarregado pelo e-mail horzonetecnologia@gmail.com.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
            LGPD &amp; Privacidade
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            Política de Privacidade
          </h1>
          <p className="mt-5 text-sm text-slate-400">
            Última atualização: 26 de Outubro de 2026
          </p>
        </header>

        <div className="divide-y divide-slate-800">
          {privacySections.map((section) => (
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
          <h2 className="text-2xl font-bold text-white">
            Precisa de esclarecer alguma questão sobre os seus dados?
          </h2>
          <p className="mt-3 leading-7 text-slate-300">
            Fale diretamente com o nosso Encarregado de Dados (DPO) através do
            e-mail{" "}
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
