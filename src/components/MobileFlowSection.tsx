import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import styles from "./MobileFlowSection.module.css";

type FlowKey = "perfil" | "vitrine" | "cupons";

type Flow = {
  label: string;
  steps: string[];
};

const flows: Record<FlowKey, Flow> = {
  perfil: {
    label: "Perfil & Links",
    steps: [
      "Bio personalizada com foto e redes",
      "Links de atalho direto",
      "Design adaptável",
      "Chamada para ação instantânea",
    ],
  },
  vitrine: {
    label: "Vitrine & Mídia",
    steps: [
      "Exibição de trabalhos e cases",
      "Media kit para marcas",
      "Métricas de engajamento",
      "Formulário de propostas",
    ],
  },
  cupons: {
    label: "Cupons & Vendas",
    steps: [
      "Cupons exclusivos de desconto",
      "Cópia de código em 1 clique",
      "Links com rastreamento",
      "Conversão simplificada",
    ],
  },
};

const flowKeys = Object.keys(flows) as FlowKey[];

function ProfileLinksFlow() {
  return (
    <div className={styles.profileFlow}>
      <div className={styles.highlightGrid}>
        <motion.div
          className={`${styles.highlightCard} ${styles.contentCard}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>✦</span>
          <strong>Seu conteúdo</strong>
          <small>Vídeos e posts recentes</small>
        </motion.div>
        <motion.div
          className={`${styles.highlightCard} ${styles.workCard}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span>◫</span>
          <strong>Seus trabalhos</strong>
          <small>Cases que conectam</small>
        </motion.div>
      </div>
      <div className={styles.profileLinks}>
        <div><span>◎</span> Instagram <b>↗</b></div>
        <div><span>▶</span> Meu portfólio <b>↗</b></div>
      </div>
      <button className={styles.profileCta} type="button">Criar algo incrível ↗</button>
    </div>
  );
}

function ShowcaseFlow() {
  return (
    <div className={styles.showcaseFlow}>
      <div className={styles.showcaseHeader}><strong>Meu universo criativo</strong><span>↗ ver tudo</span></div>
      <div className={styles.portfolioGrid}>
        <motion.div className={`${styles.portfolioCard} ${styles.portfolioLarge}`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <span className={styles.portfolioImage}>✦</span>
          <strong>Campanha de beleza</strong>
          <small>+24% alcance</small>
        </motion.div>
        <motion.div className={styles.portfolioStack} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>
          <div className={styles.portfolioCard}><span className={styles.portfolioImageAlt}>◌</span><strong>Lookbook</strong></div>
          <div className={styles.portfolioCard}><span className={styles.portfolioImagePink}>✧</span><strong>UGC case</strong></div>
        </motion.div>
      </div>
      <div className={styles.mediaStats}><div><strong>18</strong><small>marcas</small></div><div><strong>42k</strong><small>alcance</small></div><div><strong>8.6%</strong><small>engajamento</small></div></div>
      <div className={styles.brandRow}><span>marcas que confiam</span><b>natura</b><b>O Boticário</b><b>NIKE</b></div>
    </div>
  );
}

function CouponsFlow() {
  return (
    <div className={styles.couponsFlow}>
      <div className={styles.couponHeading}><span>OFERTAS DA SEMANA</span><strong>Benefícios para você</strong></div>
      <motion.div className={styles.couponCard} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
        <div><span className={styles.couponIcon}>%</span><strong>10% OFF na primeira compra</strong><small>Válido até 30/10</small></div>
        <button type="button">Copiar Cupom</button>
      </motion.div>
      <motion.div className={styles.couponCard} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>
        <div><span className={styles.couponIcon}>★</span><strong>Frete grátis exclusivo</strong><small>Para seguidores da BioWeb</small></div>
        <button type="button">Copiar Cupom</button>
      </motion.div>
      <div className={styles.trackedLink}><span>↗</span><div><strong>Seu link rastreável</strong><small>bioweb.me/seunome</small></div><b>● ativo</b></div>
    </div>
  );
}

export default function MobileFlowSection() {
  const [activeFlow, setActiveFlow] = useState<FlowKey>("perfil");
  const [activeStep, setActiveStep] = useState(0);
  const flow = flows[activeFlow];

  const selectFlow = useCallback((key: FlowKey) => {
    setActiveFlow(key);
    setActiveStep(0);
  }, []);

  return (
    <div className={styles.section}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.copy} data-gsap="stagger" data-gsap-from="left">
          <span className={styles.badge}><span className={styles.badgeDot} aria-hidden="true" />BioWeb | Vitrine Digital</span>
          <p className={styles.kicker}>Sua marca em um só lugar</p>
          <h2 className={styles.title}>Sua presença digital completa em um único link</h2>
          <p className={styles.subtitle}>Centralize seus links, portfólio, mídia kit e cupons com a sua identidade visual.</p>
          <div className={styles.tabs} role="tablist" aria-label="Recursos da BioWeb" data-gsap="stagger">
            {flowKeys.map((key) => <button className={`${styles.tab} ${activeFlow === key ? styles.tabActive : ""}`} key={key} type="button" role="tab" aria-selected={activeFlow === key} onClick={() => selectFlow(key)}>{flows[key].label}</button>)}
          </div>
          <div className={styles.steps} aria-label={`Etapas de ${flow.label}`}>
            {flow.steps.map((step, index) => <button className={`${styles.step} ${activeStep === index ? styles.stepActive : ""}`} key={step} type="button" onClick={() => setActiveStep(index)}><span className={styles.stepNumber}>{index + 1}</span><span className={styles.stepText}>{step}</span></button>)}
          </div>
          <a className={styles.cta} href="/bioweb.html">Criar Minha BioWeb <span aria-hidden="true">↗</span></a>
        </div>

        <div className={styles.simulatorArea}>
          <div className={`${styles.floatingNote} ${styles.noteBottom}`}>Sua presença digital com a sua identidade</div>
          <div className={styles.phone} data-hero-phone aria-label={`Simulação de perfil BioWeb: ${flow.label}`}>
            <div className={styles.leftControls} aria-hidden="true"><span className={styles.actionButton} /><span className={styles.volumeButton} /><span className={styles.volumeButton} /></div>
            <span className={styles.powerButton} aria-hidden="true" />
            <div className={styles.notch} aria-hidden="true"><span /></div>
            <div className={styles.screen}>
              <div className={styles.statusBar}><span>9:41</span><span>● )))</span></div>
              <div className={styles.browserProfile}><div className={styles.profileTop}><strong>Seu perfil BioWeb</strong><span>Online</span></div><div className={styles.profileCard}><span className={styles.profileAvatar} data-hero-target><span data-hero-avatar-default>✳</span><img className={styles.avatarLogo} data-hero-avatar-logo src="./img/logo.svg" alt="" /><span className={styles.avatarHalo} data-hero-halo aria-hidden="true" /></span><strong>Seu nome criativo</strong><small>Criadora UGC · Moda · Beleza · Vlogs</small><div className={styles.socialIcons}><span>◎</span><span>◉</span><span>♪</span><span>↗</span></div></div></div>
              <div className={styles.chat}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={activeFlow} className={styles.flowCard} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.22, ease: "easeOut" }}>
                    {activeFlow === "perfil" && <ProfileLinksFlow />}
                    {activeFlow === "vitrine" && <ShowcaseFlow />}
                    {activeFlow === "cupons" && <CouponsFlow />}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className={styles.screenGlow} data-hero-glow aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
