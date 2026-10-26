import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import styles from "./DesktopFlowSection.module.css";

type DesktopFlowKey = "apresentacao" | "qualificacao" | "confirmacao";

type DesktopFlow = {
  label: string;
  intro: string;
  steps: string[];
};

const flows: Record<DesktopFlowKey, DesktopFlow> = {
  apresentacao: {
    label: "Apresentação",
    intro: "Uma primeira impressão clara, autoral e feita para gerar interesse.",
    steps: [
      "Design institucional autoral",
      "Proposta de valor clara",
      "Animações de alto impacto",
      "Chamadas estratégicas (CTA)",
    ],
  },
  qualificacao: {
    label: "Form de Qualificação",
    intro: "Um formulário inteligente que entende o momento de cada oportunidade.",
    steps: [
      "Campos objetivos e intuitivos",
      "Seleção de serviço e orçamento",
      "Validação em tempo real",
      "Envio sem recarregar a página",
    ],
  },
  confirmacao: {
    label: "Confirmação & Lead",
    intro: "O contato é confirmado, qualificado e encaminhado para sua operação.",
    steps: [
      "Resposta instantânea na tela",
      "Encaminhamento automático para o CRM",
      "Notificação no WhatsApp",
      "Agendamento de reunião",
    ],
  },
};

const flowKeys = Object.keys(flows) as DesktopFlowKey[];

function PresentationView() {
  return (
    <div className={styles.siteView}>
      <div className={styles.siteNav}><strong>norte<span>.</span></strong><div><span>Sobre</span><span>Soluções</span><span>Cases</span><button type="button">Falar com especialista</button></div></div>
      <div className={styles.siteHero}>
        <div><small>ESTRATÉGIA · DESIGN · TECNOLOGIA</small><h3>Acelere o crescimento do seu negócio.</h3><p>Experiências digitais que transformam atenção em ação.</p><button type="button">Solicitar orçamento <span>↗</span></button></div>
        <motion.div className={styles.heroDashboard} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}><div /><div /><div /><strong>+38.4%</strong><small>conversão</small></motion.div>
      </div>
      <div className={styles.siteProof}><span>Marcas que crescem com a gente</span><b>natura</b><b>ORAMA</b><b>VISTA</b><b>+24 projetos</b></div>
    </div>
  );
}

function QualificationView() {
  return (
    <div className={styles.qualificationView}>
      <div className={styles.formTop}><div><small>FALE COM A NORTE</small><h3>Conte sobre o seu próximo projeto.</h3></div><span>2/3</span></div>
      <div className={styles.progress}><i /></div>
      <div className={styles.formFields}>
        <motion.label initial={{ opacity: 0.3, y: 6 }} animate={{ opacity: 1, y: 0 }}>Nome completo<span>Marina Costa <b>✓</b></span></motion.label>
        <motion.label initial={{ opacity: 0.3, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>Empresa<span>Ateliê Aurora <b>✓</b></span></motion.label>
        <motion.label initial={{ opacity: 0.3, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>Serviço desejado<span>Site institucional <b>⌄</b></span></motion.label>
      </div>
      <div className={styles.budgetRow}><span>Investimento previsto</span><strong>R$ 5.000 — R$ 10.000</strong></div>
      <motion.button className={styles.formSubmit} type="button" initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Enviar Solicitação <span>↗</span></motion.button>
    </div>
  );
}

function ConfirmationView() {
  return (
    <motion.div className={styles.confirmationView} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
      <div className={styles.successIcon}>✓</div>
      <small>OBRIGADO PELO CONTATO</small>
      <h3>Solicitação Recebida!</h3>
      <p>Seu projeto já está com o nosso time. Em breve, vamos falar sobre os próximos passos.</p>
      <span className={styles.qualifiedPill}>● Lead Qualificado</span>
      <div className={styles.responseTime}><strong>Retorno em até 15 min</strong><span>Nosso time já foi notificado.</span></div>
      <button type="button" className={styles.whatsappShortcut}>Continuar pelo WhatsApp <span>↗</span></button>
    </motion.div>
  );
}

export default function DesktopFlowSection() {
  const [activeFlow, setActiveFlow] = useState<DesktopFlowKey>("apresentacao");
  const [activeStep, setActiveStep] = useState(0);
  const flow = flows[activeFlow];

  const selectFlow = useCallback((key: DesktopFlowKey) => {
    setActiveFlow(key);
    setActiveStep(0);
  }, []);

  return (
    <section className={styles.section} aria-labelledby="desktop-flow-title">
      <div className={styles.sectionGlow} aria-hidden="true" />
      <div className={styles.layout}>
        <div className={styles.controls}>
          <span className={styles.badge}><span className={styles.badgeDot} aria-hidden="true" />Horzone Web | Sites &amp; Sistemas</span>
          <p className={styles.kicker}>Experiências que geram negócio</p>
          <h2 id="desktop-flow-title">Sites institucionais projetados para atrair e converter clientes</h2>
          <p className={styles.subtitle}>Transforme visitantes em oportunidades reais com interfaces fluidas e formulários inteligentes.</p>
          <div className={styles.tabs} role="tablist" aria-label="Etapas do site institucional">
            {flowKeys.map((key) => <button className={`${styles.tab} ${activeFlow === key ? styles.tabActive : ""}`} key={key} type="button" role="tab" aria-selected={activeFlow === key} onClick={() => selectFlow(key)}>{flows[key].label}</button>)}
          </div>
          <p className={styles.flowIntro}>{flow.intro}</p>
          <div className={styles.steps} aria-label={`Etapas de ${flow.label}`}>
            {flow.steps.map((step, index) => <button className={`${styles.step} ${activeStep === index ? styles.stepActive : ""}`} key={step} type="button" onClick={() => setActiveStep(index)}><span className={styles.stepNumber}>{index + 1}</span><span>{step}</span></button>)}
          </div>
          <a className={styles.cta} href="#contato">Desenvolver Meu Site <span aria-hidden="true">↗</span></a>
        </div>

        <div className={styles.browserWrap}>
          <div className={styles.browser}>
            <div className={styles.browserBar}><div className={styles.windowButtons} aria-hidden="true"><span className={styles.close} /><span className={styles.minimize} /><span className={styles.maximize} /></div><div className={styles.addressBar}><span className={styles.lock} aria-hidden="true">⌁</span>https://horzone.com.br/sua-empresa</div><span className={styles.browserMenu} aria-hidden="true">•••</span></div>
            <div className={styles.browserContent}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={activeFlow} className={styles.institutionalView} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.24, ease: "easeOut" }}>
                  {activeFlow === "apresentacao" && <PresentationView />}
                  {activeFlow === "qualificacao" && <QualificationView />}
                  {activeFlow === "confirmacao" && <ConfirmationView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className={styles.browserBadge}>✓ Lead capturado e notificado no seu CRM em tempo real</div>
          <div className={styles.browserShadow} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
