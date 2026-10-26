import { useState } from "react";
import styles from "./PhoneSimulator.module.css";

type SimulatorTab = "agent" | "flows";

type Message = {
  text: string;
  time: string;
  direction: "received" | "sent";
};

const conversations: Record<SimulatorTab, Message[]> = {
  agent: [
    { text: "Olá! Como posso ajudar você hoje?", time: "10:41", direction: "received" },
    { text: "Quero conhecer os planos para minha página.", time: "10:42", direction: "sent" },
    { text: "Claro! Separei as melhores opções para o seu momento ✨", time: "10:42", direction: "received" },
    { text: "Perfeito, pode me enviar?", time: "10:43", direction: "sent" },
    { text: "Enviado! Também posso tirar suas dúvidas por aqui.", time: "10:43", direction: "received" },
  ],
  flows: [
    { text: "Olá! Vi seu trabalho e gostaria de saber mais.", time: "14:08", direction: "received" },
    { text: "Que bom ter você por aqui! Escolha uma opção:", time: "14:08", direction: "sent" },
    { text: "1. Conhecer serviços\n2. Falar com especialista", time: "14:08", direction: "sent" },
    { text: "1. Conhecer serviços", time: "14:09", direction: "received" },
    { text: "Ótimo! Aqui estão os detalhes para você.", time: "14:09", direction: "sent" },
  ],
};

export function PhoneSimulator() {
  const [activeTab, setActiveTab] = useState<SimulatorTab>("agent");

  return (
    <section className={styles.wrapper} aria-label="Demonstração de atendimento no WhatsApp">
      <div className={styles.tabs} role="tablist" aria-label="Tipo de automação">
        <button
          className={`${styles.tab} ${activeTab === "agent" ? styles.tabActive : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "agent"}
          onClick={() => setActiveTab("agent")}
        >
          Agente de IA
        </button>
        <button
          className={`${styles.tab} ${activeTab === "flows" ? styles.tabActive : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "flows"}
          onClick={() => setActiveTab("flows")}
        >
          WhatsApp Flows
        </button>
      </div>

      <div className={styles.floatingCard}>Respondido em 4 segundos</div>
      <div className={styles.floatingCard}>Integração automática</div>
      <div className={styles.floatingCard}>Atendimento 24/7</div>

      <div className={styles.phone}>
        <div className={styles.screen}>
          <div className={styles.statusBar} aria-hidden="true">
            <span>9:41</span>
            <span className={styles.statusIcons}>
              <span>•••</span>
              <span className={styles.statusIcon} />
            </span>
          </div>

          <header className={styles.profile}>
            <span className={styles.profileLogo} aria-hidden="true">B</span>
            <div>
              <p className={styles.profileName}>BioWeb Studio</p>
              <span className={styles.profileStatus}>online agora</span>
            </div>
          </header>

          <div className={styles.messages} aria-live="polite">
            {conversations[activeTab].map((message, index) => (
              <div
                className={`${styles.message} ${
                  message.direction === "sent" ? styles.messageSent : styles.messageReceived
                }`}
                key={`${activeTab}-${index}`}
              >
                {message.text.split("\n").map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
                <span className={styles.messageTime}>{message.time} ✓✓</span>
              </div>
            ))}
          </div>

          <div className={styles.composer} aria-hidden="true">
            <span className={styles.composerInput}>Digite uma mensagem...</span>
            <span className={styles.send}>↑</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhoneSimulator;
