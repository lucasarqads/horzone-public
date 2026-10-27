import { CheckCircle2, XCircle } from "lucide-react";
import styles from "./ComparisonSection.module.css";

const limitations = [
  "Vendas limitadas apenas a quem passa na frente do estabelecimento",
  "Atendimento encerrado assim que as portas se fecham",
  "Tempo perdido respondendo manualmente as mesmas dúvidas no WhatsApp",
  "Perde clientes para concorrentes que possuem vitrine e agendamento online",
  "Sem controle de histórico ou acompanhamento de potenciais compradores",
];

const benefits = [
  "Vitrine e captação de clientes rodando 24 horas por dia, 7 dias por semana",
  "Agendamentos e orçamentos qualificados de forma 100% automática",
  "Posicionamento de marca premium que transmite autoridade imediata",
  "Atendimento rápido sem deixar nenhum cliente esperando",
  "Leads organizados e prontos para o fechamento de vendas",
];

export default function ComparisonSection() {
  return (
    <section className={styles.section} aria-labelledby="comparison-title">
      <div className={styles.header} data-gsap="stagger">
        <span className={styles.eyebrow}>TRANSFORMAÇÃO DIGITAL</span>
        <h2 id="comparison-title">A mesma estrutura. Outra escala de vendas.</h2>
        <p>
          Compare o dia a dia de quem depende apenas da porta com o de quem
          tem um ecossistema digital com a Horzone.
        </p>
      </div>

      <div className={styles.grid}>
        <article className={styles.todayCard} data-gsap="reveal" data-gsap-from="left">
          <div className={styles.cardHeader}>
            <span className={styles.cardKicker}>SEM A HORZONE</span>
            <span className={styles.cardIcon}><XCircle size={18} /></span>
          </div>
          <h3>Hoje (Apenas a Porta)</h3>
          <ul data-gsap="stagger" data-gsap-from="left">
            {limitations.map((item) => (
              <li key={item}>
                <XCircle size={18} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.futureCard} data-gsap="reveal" data-gsap-from="right">
          <span className={styles.recommended}>Recomendado</span>
          <div className={styles.cardHeader}>
            <span className={styles.cardKicker}>ECOSSISTEMA HORZONE</span>
            <span className={styles.cardIcon}><CheckCircle2 size={18} /></span>
          </div>
          <h3>Com a Horzone (Físico + Digital)</h3>
          <ul data-gsap="stagger" data-gsap-from="right">
            {benefits.map((item) => (
              <li key={item}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
