import { BriefcaseBusiness, Code2 } from "lucide-react";
import styles from "./Footer.module.css";

const solutions = [
  ["BioWeb Express", "#tudo-conectado"],
  ["Sites Institucionais", "#tudo-conectado"],
  ["Sistemas Web Custom", "#tudo-conectado"],
  ["Tabela de Preços", "#planos"],
];

const supportLinks = [
  ["Falar com especialista", "#contato"],
  ["Central de atendimento", "#contato"],
  ["Agendar reunião", "#contato"],
];

const legalLinks = [
  ["Termos de Serviço", "/termos"],
  ["Política de Privacidade", "/privacidade"],
  ["Contato: horzonetecnologia@gmail.com", "mailto:horzonetecnologia@gmail.com"],
  ["Suporte Técnico", "#contato"],
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: string[][];
}) {
  return (
    <div>
      <h2 className={styles.columnTitle}>{title}</h2>
      <ul className={styles.linkList}>
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.grid} data-gsap="stagger">
          <div className={styles.brandColumn}>
            <a href="/" className={styles.logoLink} aria-label="Horzone, página inicial">
              <img src="./img/logo.svg" alt="" className={styles.logo} />
              <span>Horzone</span>
            </a>
            <p className={styles.description}>
              Sistemas web, landing pages e vitrines digitais sob medida para
              acelerar o seu negócio.
            </p>
            <span className={styles.badge}>
              <Code2 size={16} aria-hidden="true" />
              Desenvolvimento Web &amp; Sistemas
            </span>
            <nav aria-label="Redes sociais" className={styles.socials}>
              <a href="https://www.instagram.com/horzoneux/" target="_blank" rel="noreferrer" aria-label="Instagram da Horzone">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <BriefcaseBusiness size={18} />
              </a>
            </nav>
          </div>

          <LinkColumn title="SOLUÇÕES" links={solutions} />
          <LinkColumn title="SUPORTE & CONTATO" links={supportLinks} />
          <LinkColumn title="LEGAL" links={legalLinks} />
        </div>

        <div className={styles.copyright} data-gsap="reveal">
          <span>Termos de Uso · Versão 1.0</span>
        </div>
        <p className={styles.companyDetails} data-gsap="reveal">
          © 2026 Horzone LTDA · CNPJ 65.625.187/0001-64 · São Paulo · Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  );
}
