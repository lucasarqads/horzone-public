import { Check } from "lucide-react";
import styles from "./PricingSection.module.css";

export const pricingPlans = [
  {
    name: "BioWeb Express",
    badge: "Vitrine Digital",
    audience: "Para criadores, autônomos e pequenos negócios.",
    setup: "A partir de R$ 380",
    setupNote: "ou parcelado no cartão",
    recurring: "+ R$ 69 / mês",
    recurringNote: "Hospedagem & Manutenção",
    features: [
      "Layout autoral responsivo com sua identidade",
      "Seções de Perfil, Serviços e Mídia Kit / Cupons",
      "Botões de ação direta para WhatsApp e agendamento",
      "Carregamento ultra-rápido e otimizado",
      "Entrega ágil (5 a 7 dias úteis)",
    ],
    cta: "Criar BioWeb ↗",
  },
  {
    name: "Horzone Pro",
    badge: "Mais Popular",
    audience: "Para clínicas, imobiliárias, B2B e empresas de serviços.",
    setup: "A partir de R$ 2.800",
    setupNote: "ou parcelado no cartão",
    recurring: "+ R$ 149 / mês",
    recurringNote: "Hospedagem + Suporte + Ajustes",
    features: [
      "Site Institucional / Landing Page de Alta Conversão (AIDA)",
      "Formulário inteligente de captura e qualificação de leads",
      "Integração direta com WhatsApp, E-mail e CRM",
      "Animações interativas (Framer Motion) e SEO",
      "Certificado SSL + Domínio próprio configurado",
      "Entrega em 12 a 20 dias",
    ],
    cta: "Desenvolver Site Pro ↗",
    featured: true,
  },
  {
    name: "Horzone Custom",
    badge: "Sistemas & Plataformas",
    audience: "Para empresas com processos complexos, SaaS e automações.",
    setup: "Sob Consulta",
    setupNote: "Projetos a partir de R$ 5.000",
    recurring: "Sob medida",
    recurringNote: "a partir de R$ 290/mês",
    features: [
      "Desenvolvimento Full-Stack sob medida (React/Node.js)",
      "Painéis administrativos, dashboards e portais",
      "Simuladores interativos e geradores de propostas",
      "Automação de atendimento (WhatsApp Flows / IA)",
      "Gestão do projeto em Sprints + SLA de suporte prioritário",
    ],
    cta: "Falar com Consultor ↗",
  },
];

type PricingSectionProps = {
  onSelectPlan?: (planName: string) => void;
};

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  return (
    <section id="planos" className={styles.section} aria-labelledby="pricing-title">
      <div className={styles.header} data-gsap="stagger">
        <span className={styles.eyebrow}>INVESTIMENTO &amp; PLANOS</span>
        <h2 id="pricing-title">Escolha o ecossistema ideal para o seu momento</h2>
        <p>
          Desenvolvimento personalizado sob medida com infraestrutura,
          hospedagem e suporte contínuo para o seu negócio.
        </p>
      </div>

      <div className={styles.grid} data-gsap="stagger" data-gsap-from="scale">
        {pricingPlans.map((plan) => (
          <article
            key={plan.name}
            className={`${styles.card} ${plan.featured ? styles.featured : ""}`}
          >
            {plan.featured && <span className={styles.popular}>{plan.badge}</span>}
            <div className={styles.cardTop}>
              <span className={styles.badge}>{plan.featured ? "Plano recomendado" : plan.badge}</span>
              <h3>{plan.name}</h3>
              <p>{plan.audience}</p>
            </div>

            <div className={styles.pricing}>
              <span className={styles.priceLabel}>Setup</span>
              <strong>{plan.setup}</strong>
              <small>{plan.setupNote}</small>
              <div className={styles.recurring}>
                <strong>{plan.recurring}</strong>
                <span>{plan.recurringNote}</span>
              </div>
            </div>

            <ul className={styles.features} data-gsap="stagger">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={17} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`${styles.cta} ${plan.featured ? styles.primaryCta : ""}`}
              onClick={() => onSelectPlan?.(plan.name)}
            >
              {plan.cta}
            </button>
          </article>
        ))}
      </div>

      <p className={styles.footnote} data-gsap="reveal">
        Todos os planos incluem hospedagem gerenciada 24/7, certificado de
        segurança SSL e backups diários.
      </p>
    </section>
  );
}
