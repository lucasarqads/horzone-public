import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
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
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <span className={styles.eyebrow}>TRANSFORMAÇÃO DIGITAL</span>
        <h2 id="comparison-title">A mesma estrutura. Outra escala de vendas.</h2>
        <p>
          Compare o dia a dia de quem depende apenas da porta com o de quem
          tem um ecossistema digital com a Horzone.
        </p>
      </motion.div>

      <div className={styles.grid}>
        <motion.article
          className={styles.todayCard}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardKicker}>SEM A HORZONE</span>
            <span className={styles.cardIcon}><XCircle size={18} /></span>
          </div>
          <h3>Hoje (Apenas a Porta)</h3>
          <ul>
            {limitations.map((item) => (
              <li key={item}>
                <XCircle size={18} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          className={styles.futureCard}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
        >
          <span className={styles.recommended}>Recomendado</span>
          <div className={styles.cardHeader}>
            <span className={styles.cardKicker}>ECOSSISTEMA HORZONE</span>
            <span className={styles.cardIcon}><CheckCircle2 size={18} /></span>
          </div>
          <h3>Com a Horzone (Físico + Digital)</h3>
          <ul>
            {benefits.map((item) => (
              <li key={item}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      </div>
    </section>
  );
}
