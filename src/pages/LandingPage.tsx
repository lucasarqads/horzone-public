import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import DesktopFlowSection from "../components/DesktopFlowSection";
import MobileFlowSection from "../components/MobileFlowSection";
import ComparisonSection from "../components/ComparisonSection";
import PricingSection, { pricingPlans } from "../components/PricingSection";
import Footer from "../components/Footer";
import { submitLead, warmLeadService } from "../services/leadService";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// No celular a barra de endereço some/volta ao parar e retomar o scroll, gerando
// resize; o refresh completo do ScrollTrigger nesse momento é o que engasgava.
// Em telas só de toque o refresh fica para load e troca de orientação.
const isTouchOnly = ScrollTrigger.isTouch === 1;
ScrollTrigger.config({
  ignoreMobileResize: true,
  ...(isTouchOnly && { autoRefreshEvents: "visibilitychange,DOMContentLoaded,load" }),
});

type ContactField = "name" | "email" | "phone" | "instagram" | "plan" | "message";
type ContactErrors = Partial<Record<ContactField, string>>;

const contactFields: ContactField[] = [
  "name",
  "email",
  "phone",
  "instagram",
  "plan",
  "message",
];

async function validateContactField(
  field: ContactField,
  value: string,
): Promise<string> {
  const trimmedValue = value.trim();

  switch (field) {
    case "name":
      if (trimmedValue.length < 2) return "Informe seu nome completo.";
      if (trimmedValue.length > 100) return "Use no máximo 100 caracteres.";
      return "";
    case "email":
      if (!trimmedValue) return "Informe seu e-mail.";
      if (trimmedValue.length > 254) return "Use no máximo 254 caracteres.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
        return "Informe um e-mail válido.";
      }
      return "";
    case "phone": {
      if (!trimmedValue) return "Informe seu WhatsApp com DDD.";
      if (trimmedValue.length > 30) return "Use no máximo 30 caracteres.";

      let parsePhoneNumberFromString: typeof import("libphonenumber-js/max")["parsePhoneNumberFromString"];
      try {
        ({ parsePhoneNumberFromString } = await import("libphonenumber-js/max"));
      } catch {
        return "Não foi possível carregar a validação telefônica. Tente novamente.";
      }

      try {
        const phoneNumber = parsePhoneNumberFromString(trimmedValue, {
          defaultCountry: "BR",
          extract: false,
        });
        if (!phoneNumber?.isValid() || phoneNumber.ext) {
          return "Informe um número com formato válido e DDD. No Brasil, use (11) 91234-5678.";
        }
      } catch {
        return "Informe um número válido para WhatsApp, com DDD.";
      }

      return "";
    }
    case "instagram":
      if (!trimmedValue) return "";
      if (trimmedValue.length > 200) return "Use no máximo 200 caracteres.";
      let isHttpUrl = false;
      try {
        const url = new URL(trimmedValue);
        isHttpUrl =
          ["http:", "https:"].includes(url.protocol) &&
          url.hostname.includes(".");
      } catch {
        isHttpUrl = false;
      }
      if (!/^@[a-z0-9._]{1,30}$/i.test(trimmedValue) && !isHttpUrl) {
        return "Informe @usuário ou um endereço iniciado por https://.";
      }
      return "";
    case "plan":
      if (
        trimmedValue &&
        !pricingPlans.some((plan) => plan.name === trimmedValue)
      ) {
        return "Selecione um plano válido.";
      }
      return "";
    case "message":
      if (trimmedValue.length < 5) {
        return "Conte um pouco mais (mínimo de 5 caracteres).";
      }
      if (trimmedValue.length > 2000) {
        return "Use no máximo 2000 caracteres.";
      }
      return "";
  }
}

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = useRef(false);
  const pageRef = useRef<HTMLElement>(null);
  const [formFeedback, setFormFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<ContactErrors>({});

  useEffect(() => {
    void warmLeadService().catch((error: unknown) => {
      console.warn("Não foi possível pré-aquecer a API de leads:", error);
    });
  }, []);

  // Links externos como /#contato (vindos da página da BioWeb) chegam antes da seção existir.
  useEffect(() => {
    const sectionId = window.location.hash.slice(1);
    if (sectionId) document.getElementById(sectionId)?.scrollIntoView();
  }, []);

  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const preventRestrictedShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isRestrictedShortcut =
        (event.ctrlKey || event.metaKey) && ["c", "u", "s"].includes(key);

      if (isRestrictedShortcut || event.key === "F12") {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventRestrictedShortcuts);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventRestrictedShortcuts);
    };
  }, []);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // No celular os reveals tocam uma vez só e o parallax fica desligado,
        // para não disputar frames com o scroll.
        const isMobile = !window.matchMedia("(min-width: 768px)").matches;

        // Enquanto o GSAP anima, o transition do CSS fica desligado para não
        // brigar com ele; no fim o transform é limpo para os hovers voltarem.
        const setAnimating = (targets: gsap.TweenTarget, animating: boolean) =>
          gsap.utils
            .toArray<HTMLElement>(targets)
            .forEach((element) => element.classList.toggle("gsap-animating", animating));
        const settle = (targets: gsap.TweenTarget) => {
          setAnimating(targets, false);
          gsap.set(targets, { clearProps: "transform" });
        };

        // O reverse roda mais rápido que a entrada ao voltar o scroll.
        const playReveal = (st: ScrollTrigger) => {
          const animation = st.animation;
          if (!animation || (animation.progress() === 1 && !animation.reversed())) return;
          setAnimating((animation as gsap.core.Tween).targets(), true);
          animation.timeScale(1).play();
        };
        const reverseReveal = (st: ScrollTrigger) => {
          const animation = st.animation;
          if (!animation || animation.progress() === 0) return;
          setAnimating((animation as gsap.core.Tween).targets(), true);
          animation.timeScale(2.5).reverse();
        };
        const revealTrigger = (trigger: HTMLElement): ScrollTrigger.Vars => ({
          trigger,
          // clamp: no fim da página (rodapé) o ponto 85% pode ser inalcançável; assim o reveal ainda dispara.
          start: "clamp(top 85%)",
          toggleActions: "none none none none",
          onEnter: playReveal,
          onLeaveBack: isMobile ? undefined : reverseReveal,
        });

        // data-gsap-from escolhe de onde o conteúdo entra.
        const fromVars = (element: HTMLElement, distance: number): gsap.TweenVars => {
          switch (element.dataset.gsapFrom) {
            case "left":
              return { x: -distance, opacity: 0 };
            case "right":
              return { x: distance, opacity: 0 };
            case "scale":
              return { scale: 0.92, y: distance / 2, opacity: 0 };
            default:
              return { y: distance, opacity: 0 };
          }
        };

        const reveal = (targets: gsap.TweenTarget, vars: gsap.TweenVars, trigger: HTMLElement) =>
          gsap.from(targets, {
            ease: "power3.out",
            ...vars,
            onComplete: () => settle(targets),
            onReverseComplete: () => setAnimating(targets, false),
            scrollTrigger: revealTrigger(trigger),
          });

        const heroTargets = "[data-gsap^='hero-'], [data-gsap='hero-actions'] > *, [data-gsap='hero-proof'] > *";
        setAnimating(heroTargets, true);
        gsap
          .timeline({
            defaults: { ease: "power3.out", duration: 0.9 },
            onComplete: () => settle(heroTargets),
          })
          .from("[data-gsap='hero-badge']", { y: 24, opacity: 0, duration: 0.7 })
          .from("[data-gsap='hero-title']", { y: 48, opacity: 0 }, "-=0.45")
          .from("[data-gsap='hero-copy']", { y: 32, opacity: 0 }, "-=0.6")
          .from("[data-gsap='hero-actions'] > *", { y: 24, opacity: 0, stagger: 0.08, duration: 0.7 }, "-=0.55")
          .from("[data-gsap='hero-proof'] > *", { y: 16, opacity: 0, stagger: 0.08, duration: 0.6 }, "-=0.45")
          // Só opacidade: o slot é a referência de medida da viagem do logo.
          .from("[data-gsap='hero-visual']", { opacity: 0, duration: 1.2 }, 0.2);

        // O logo do hero desce com o scroll até o avatar do celular da BioWeb
        // e se funde a ele; voltando o scroll, refaz o caminho ao contrário.
        const heroSlot = page.querySelector<HTMLElement>("[data-hero-slot]");
        const heroTarget = page.querySelector<HTMLElement>("[data-hero-target]");
        const heroPhone = page.querySelector<HTMLElement>("[data-hero-phone]");
        let removeMeasureListener: (() => void) | undefined;
        if (heroSlot && heroTarget && heroPhone) {
          let distance = { x: 0, y: 0, scale: 1 };
          const measure = () => {
            const from = heroSlot.getBoundingClientRect();
            const to = heroTarget.getBoundingClientRect();
            distance = {
              x: to.left + to.width / 2 - (from.left + from.width / 2),
              y: to.top + to.height / 2 - (from.top + from.height / 2),
              // O desenho do logo ocupa ~60% do SVG; termina um pouco maior que o avatar.
              scale: (to.width * 1.7) / from.width,
            };
          };
          measure();
          ScrollTrigger.addEventListener("refreshInit", measure);
          removeMeasureListener = () => ScrollTrigger.removeEventListener("refreshInit", measure);

          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: heroSlot,
                start: 0,
                endTrigger: heroPhone,
                end: "center center",
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            })
            .to("[data-hero-box]", {
              x: () => distance.x,
              y: () => distance.y,
              scale: () => distance.scale,
              ease: "power1.inOut",
              duration: 1,
            }, 0)
            .to("[data-hero-shadow]", { opacity: 0, scaleX: 0.5, duration: 0.2 }, 0)
            .to("[data-hero-glow]", { opacity: 1, duration: 0.25 }, 0.7)
            .to("[data-hero-box]", { opacity: 0, filter: "brightness(1.5) blur(1px)", duration: 0.12 }, 0.9)
            .to("[data-hero-avatar-default]", { opacity: 0, duration: 0.12 }, 0.9)
            .to("[data-hero-avatar-logo], [data-hero-halo]", { opacity: 1, duration: 0.12 }, 0.92)
            .to("[data-hero-glow]", { opacity: 0.35, duration: 0.1 }, 1);
        }

        gsap.utils.toArray<HTMLElement>("[data-gsap='reveal']").forEach((element) => {
          reveal(element, { ...fromVars(element, 56), duration: 1 }, element);
        });

        gsap.utils.toArray<HTMLElement>("[data-gsap='stagger']").forEach((group) => {
          reveal(
            Array.from(group.children),
            { ...fromVars(group, 36), duration: 0.75, stagger: 0.09 },
            group,
          );
        });

        // Voltando o scroll, os elementos saem assim que a seção anterior
        // aparece no topo, sem esperar cada um descer até a linha de entrada.
        const reveals = ScrollTrigger.getAll().filter((st) => st.vars.onLeaveBack === reverseReveal);
        page.querySelectorAll<HTMLElement>("section").forEach((section) => {
          const sectionReveals = reveals.filter(
            (st) => (st.trigger as Element).closest("section") === section,
          );
          if (!sectionReveals.length) return;

          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            onEnter: () =>
              sectionReveals.forEach((st) => {
                if (st.scroll() >= st.start) playReveal(st);
              }),
            onLeaveBack: () => sectionReveals.forEach(reverseReveal),
          });
        });

        if (isMobile) return () => removeMeasureListener?.();

        gsap.utils.toArray<HTMLElement>("[data-gsap-parallax]").forEach((element) => {
          const speed = Number(element.dataset.gsapParallax) || 20;
          gsap.fromTo(
            element,
            { yPercent: -speed },
            {
              yPercent: speed,
              ease: "none",
              scrollTrigger: {
                trigger: element.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        return () => removeMeasureListener?.();
      });
    }, page);

    const refreshOnRotate = () => ScrollTrigger.refresh();
    if (isTouchOnly) window.addEventListener("orientationchange", refreshOnRotate);

    return () => {
      window.removeEventListener("orientationchange", refreshOnRotate);
      ctx.revert();
    };
  }, []);

  const prewarmLeadService = () => {
    void warmLeadService().catch((error: unknown) => {
      console.warn("Não foi possível pré-aquecer a API de leads:", error);
    });
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitLock.current) return;
    submitLock.current = true;
    setIsSubmitting(true);

    const form = event.currentTarget;
    setFormFeedback(null);
    try {
      const formData = new FormData(form);
      const nextErrors: ContactErrors = {};
      await Promise.all(
        contactFields.map(async (field) => {
          const value =
            field === "plan"
              ? selectedPlan
              : String(formData.get(field) ?? "");
          const error = await validateContactField(field, value);
          if (error) nextErrors[field] = error;
        }),
      );

      setFormErrors(nextErrors);
      const firstInvalidField = contactFields.find((field) => nextErrors[field]);
      if (firstInvalidField) {
        const invalidElement = form.elements.namedItem(firstInvalidField);
        if (invalidElement instanceof HTMLElement) invalidElement.focus();
        return;
      }

      await submitLead({
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        instagram:
          String(formData.get("instagram") ?? "").trim() || undefined,
        plan: selectedPlan || "Ainda quero conhecer",
        message: String(formData.get("message") ?? "").trim(),
      });
      form.reset();
      setSelectedPlan("");
      setFormErrors({});
      setFormFeedback({
        type: "success",
        message: "Recebemos seus dados! Em breve entraremos em contato.",
      });
    } catch (error) {
      setFormFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível enviar seus dados. Tente novamente.",
      });
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
    }
  };

  const validateFieldOnBlur = async (
    field: ContactField,
    value: string,
  ) => {
    if (value.length === 0) {
      setFormErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
      return;
    }

    const error = await validateContactField(field, value);
    setFormErrors((current) => {
      const next = { ...current };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const clearFieldError = (field: ContactField) => {
    setFormFeedback(null);
    setFormErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  return (
    <main ref={pageRef} className="landing-page min-h-screen bg-[#faf9f6] text-slate-950">
      <a
        href="https://wa.me/qr/GEGVWDDK4XMDP1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Horzone pelo WhatsApp"
        title="Falar pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-emerald-300 sm:bottom-7 sm:right-7"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-current"
        >
          <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.55 0 .24 5.31.24 11.84c0 2.09.55 4.13 1.59 5.93L.14 24l6.38-1.67a11.84 11.84 0 0 0 5.56 1.41h.01c6.52 0 11.83-5.31 11.83-11.84 0-3.16-1.23-6.13-3.4-8.42ZM12.09 21.7h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.79.99 1.01-3.69-.23-.38a9.84 9.84 0 0 1-1.51-5.2C2.18 6.4 6.62 1.96 12.08 1.96c2.64 0 5.12 1.03 6.99 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.9-9.88 9.9Zm5.42-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.22 3.1c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
        WhatsApp
      </a>
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#faf9f6]/95 md:bg-[#faf9f6]/90 md:backdrop-blur-xl">
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        >
          <a href="/" aria-label="Horzone, página inicial" className="flex items-center gap-2">
            <img src="./img/logo.svg" alt="" className="h-9 w-9 object-contain" />
            <span className="text-xl font-bold tracking-tight">Horzone</span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <button type="button" className="transition hover:text-indigo-700" onClick={() => scrollToSection("tudo-conectado")}>Serviços</button>
            <button type="button" className="transition hover:text-indigo-700" onClick={() => scrollToSection("planos")}>Planos</button>
            <button type="button" className="transition hover:text-indigo-700" onClick={() => scrollToSection("como-funciona")}>Como funciona</button>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection("contato")}
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Fale com a gente
          </button>
        </nav>
      </header>

      {/* z-20 deixa o logo viajante por cima das seções seguintes */}
      <section className="landing-hero relative isolate z-20">
        <div
          aria-hidden="true"
          data-gsap-parallax="25"
          className="absolute -right-32 -top-28 -z-10 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,rgba(199,210,254,0.6),transparent)]"
        />
        <div className="landing-hero-content mx-auto flex max-w-7xl flex-col items-center gap-10 px-5 py-14 sm:gap-14 sm:px-8 sm:py-20 lg:flex-row lg:justify-between lg:py-24 xl:py-28">
          <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
            <p data-gsap="hero-badge" className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Seu talento merece uma vitrine
            </p>
            <h1 data-gsap="hero-title" className="landing-hero-title max-w-3xl text-4xl font-bold leading-[0.98] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Seu negócio presencial,{" "}
              <span className="text-indigo-600">com estrutura digital.</span>
            </h1>
            <p data-gsap="hero-copy" className="landing-hero-copy mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Desenvolvemos ecossistemas digitais sob medida — de vitrines interativas a sistemas operacionais — para atrair clientes, automatizar atendimentos e transformar o seu negócio em uma estrutura de vendas 24 horas por dia.
            </p>
            <div data-gsap="hero-actions" className="landing-hero-actions mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/bioweb.html"
                className="rounded-full bg-indigo-600 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Descubra a BioWeb
              </a>
              <a
                href="/site.html"
                className="rounded-full border border-indigo-200 bg-indigo-50 px-7 py-3.5 text-center text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
              >
                Sistema para negócios
              </a>
              <button
                type="button"
                onClick={() => scrollToSection("planos")}
                className="rounded-full border border-slate-300 bg-white/70 px-7 py-3.5 text-center text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-white"
              >
                Conheça os planos
              </button>
            </div>
            <div data-gsap="hero-proof" className="landing-hero-proof mt-10 flex flex-col items-center gap-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <span><strong className="text-slate-950">✓</strong> Vitrine e captura 24/7</span>
              <span><strong className="text-slate-950">✓</strong> Design autoral e exclusivo</span>
              <span><strong className="text-slate-950">✓</strong> Estrutura pronta para converter</span>
            </div>
          </div>

          {/* O slot nunca se move: serve de referência para medir a viagem do logo até o celular. */}
          <div data-hero-slot data-gsap="hero-visual" className="relative aspect-square w-52 shrink-0 sm:w-64 lg:w-[22rem] xl:w-[26rem]">
            <div
              aria-hidden="true"
              data-hero-shadow
              className="absolute inset-x-[22%] top-[80%] h-[7%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(30,27,75,0.28),transparent)]"
            />
            <img
              data-hero-box
              src="./img/logo.svg"
              alt=""
              className="relative z-10 h-full w-full object-contain will-change-transform"
            />
          </div>

        </div>
      </section>

      <section id="tudo-conectado" className="landing-fullscreen-section landing-connected-section scroll-mt-0 bg-white py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div data-gsap="stagger" className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Tudo conectado</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Uma vitrine, muitas possibilidades.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Apresente sua marca pessoal de um jeito organizado, bonito e pronto para compartilhar.
            </p>
          </div>
          <div className="mt-7 space-y-12 lg:space-y-16">
            <MobileFlowSection />
            <DesktopFlowSection />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="landing-fullscreen-section scroll-mt-0 py-16 sm:py-20 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-5 text-center sm:px-8">
          <div data-gsap="stagger" className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Simples para começar</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Seu próximo passo profissional começa aqui.</h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-600">
              Você escolhe um plano e compartilha suas informações. A BioWeb organiza sua presença digital para que seu trabalho seja visto e lembrado.
            </p>
            <button type="button" onClick={() => scrollToSection("contato")} className="mt-7 inline-flex items-center gap-2 font-semibold text-indigo-700 hover:text-indigo-900">
              Quero conversar sobre meu perfil <span aria-hidden="true">→</span>
            </button>
          </div>
          <ol data-gsap="stagger" className="grid w-full max-w-5xl gap-4 text-left md:grid-cols-3">
            {[
              ["01", "Preencha o formulário", "Encontre o formato que combina com o momento da sua carreira."],
              ["02", "Conte sua história", "Compartilhe seus links, sua bio e os trabalhos que quer destacar."],
              ["03", "Divulgue seu perfil", "Envie seu site para marcas, clientes e para a bio das suas redes."],
            ].map(([number, title, description]) => (
              <li key={number} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/10">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">{number}</span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-slate-950">
        <div
          aria-hidden="true"
          data-gsap-parallax="30"
          className="pointer-events-none absolute -left-48 top-24 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(79,70,229,0.2),transparent)]"
        />
        <div
          aria-hidden="true"
          data-gsap-parallax="-20"
          className="pointer-events-none absolute -right-48 top-[42%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(14,165,233,0.15),transparent)]"
        />
        <div
          aria-hidden="true"
          data-gsap-parallax="15"
          className="pointer-events-none absolute left-1/3 bottom-[-18rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.15),transparent)]"
        />
        <div className="relative z-10 space-y-8">
          <ComparisonSection />
          <PricingSection
            onSelectPlan={(planName) => {
              setSelectedPlan(planName);
              scrollToSection("contato");
            }}
          />
        </div>
      </section>

      <section id="contato" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div data-gsap="stagger" data-gsap-from="left" className="max-w-2xl text-center lg:text-left">
            <img src="./img/logo.svg" alt="Horzone" className="contact-floating-logo mx-auto mb-6 h-24 w-24 object-contain" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Vamos conversar</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Sua próxima oportunidade pode começar com um link.</h2>
            <p className="mt-5 leading-7 text-slate-600">
              Deixe seus dados e conte o que você precisa. Nossa equipe entrará em contato em breve.
            </p>
          </div>

          <form data-gsap="reveal" data-gsap-from="right" noValidate onSubmit={handleSubmit} onFocusCapture={prewarmLeadService} aria-busy={isSubmitting} className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
            <div data-gsap="stagger" className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Seu nome
                <input id="contact-name" required name="name" autoComplete="name" minLength={2} maxLength={100} aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? "contact-name-error" : undefined} onBlur={(event) => validateFieldOnBlur("name", event.currentTarget.value)} onChange={() => clearFieldError("name")} className={`mt-2 w-full rounded-xl border bg-[#faf9f6] px-4 py-3 text-base font-normal outline-none transition focus:ring-4 md:text-sm ${formErrors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10"}`} placeholder="Como podemos te chamar?" />
                {formErrors.name && <span id="contact-name-error" className="mt-1 block text-xs font-medium text-red-600">{formErrors.name}</span>}
              </label>
              <label className="text-sm font-semibold text-slate-700">
                E-mail
                <input id="contact-email" required name="email" type="email" autoComplete="email" maxLength={254} aria-invalid={Boolean(formErrors.email)} aria-describedby={formErrors.email ? "contact-email-error" : undefined} onBlur={(event) => validateFieldOnBlur("email", event.currentTarget.value)} onChange={() => clearFieldError("email")} className={`mt-2 w-full rounded-xl border bg-[#faf9f6] px-4 py-3 text-base font-normal outline-none transition focus:ring-4 md:text-sm ${formErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10"}`} placeholder="voce@email.com" />
                {formErrors.email && <span id="contact-email-error" className="mt-1 block text-xs font-medium text-red-600">{formErrors.email}</span>}
              </label>
              <label className="text-sm font-semibold text-slate-700">
                WhatsApp
                <input id="contact-whatsapp" required name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} aria-invalid={Boolean(formErrors.phone)} aria-describedby={formErrors.phone ? "contact-whatsapp-error" : undefined} onBlur={(event) => validateFieldOnBlur("phone", event.currentTarget.value)} onChange={() => clearFieldError("phone")} className={`mt-2 w-full rounded-xl border bg-[#faf9f6] px-4 py-3 text-base font-normal outline-none transition focus:ring-4 md:text-sm ${formErrors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10"}`} placeholder="(11) 99999-9999" />
                {formErrors.phone && <span id="contact-whatsapp-error" className="mt-1 block text-xs font-medium text-red-600">{formErrors.phone}</span>}
              </label>
            </div>
            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Instagram ou portfólio (opcional)
              <input id="contact-social" name="instagram" maxLength={200} aria-invalid={Boolean(formErrors.instagram)} aria-describedby={formErrors.instagram ? "contact-social-error" : undefined} onBlur={(event) => validateFieldOnBlur("instagram", event.currentTarget.value)} onChange={() => clearFieldError("instagram")} className={`mt-2 w-full rounded-xl border bg-[#faf9f6] px-4 py-3 text-base font-normal outline-none transition focus:ring-4 md:text-sm ${formErrors.instagram ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10"}`} placeholder="@seuperfil ou link https://" />
              {formErrors.instagram && <span id="contact-social-error" className="mt-1 block text-xs font-medium text-red-600">{formErrors.instagram}</span>}
            </label>
            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Plano de interesse
              <select id="contact-plan" name="plan" value={selectedPlan} aria-invalid={Boolean(formErrors.plan)} aria-describedby={formErrors.plan ? "contact-plan-error" : undefined} onBlur={(event) => validateFieldOnBlur("plan", event.currentTarget.value)} onChange={(event) => { setSelectedPlan(event.target.value); clearFieldError("plan"); }} className={`mt-2 w-full rounded-xl border bg-[#faf9f6] px-4 py-3 text-base font-normal outline-none transition focus:ring-4 md:text-sm ${formErrors.plan ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10"}`}>
                <option value="">Ainda quero conhecer</option>
                {pricingPlans.map((plan) => <option key={plan.name} value={plan.name}>{plan.name}</option>)}
              </select>
              {formErrors.plan && <span id="contact-plan-error" className="mt-1 block text-xs font-medium text-red-600">{formErrors.plan}</span>}
            </label>
            <label className="mt-5 block text-sm font-semibold text-slate-700">
              O que você gostaria de criar?
              <textarea id="contact-message" required name="message" rows={4} minLength={5} maxLength={2000} aria-invalid={Boolean(formErrors.message)} aria-describedby={formErrors.message ? "contact-message-error" : undefined} onBlur={(event) => validateFieldOnBlur("message", event.currentTarget.value)} onChange={() => clearFieldError("message")} className={`mt-2 w-full resize-y rounded-xl border bg-[#faf9f6] px-4 py-3 text-base font-normal outline-none transition focus:ring-4 md:text-sm ${formErrors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10"}`} placeholder="Conte um pouco sobre você e seu trabalho..." />
              {formErrors.message && <span id="contact-message-error" className="mt-1 block text-xs font-medium text-red-600">{formErrors.message}</span>}
            </label>
            <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting && (
                <span
                  aria-hidden="true"
                  className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white align-[-3px]"
                />
              )}
              {isSubmitting ? "Enviando..." : "Enviar interesse"}
            </button>
            <div className="mt-3 flex min-h-10 items-center justify-center">
              {isSubmitting && (
                <p
                  role="status"
                  className="inline-flex items-center gap-2 text-center text-sm text-slate-600"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0 animate-bounce text-indigo-600"
                  >
                    <path d="M12 19v3" />
                    <path d="M12 15.5 8.5 19l-1.5-1.5L9 12l-5-4 1-2 7 2 7-2 1 2-5 4 2 5.5-1.5 1.5L12 15.5Z" />
                    <path d="M12 2v2" />
                  </svg>
                  <span>A conectar ao servidor e a enviar mensagem...</span>
                </p>
              )}
            </div>
            {formFeedback && (
              <p
                role={formFeedback.type === "error" ? "alert" : "status"}
                className={`mt-4 rounded-xl px-4 py-3 text-sm leading-6 ${
                  formFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-900"
                    : "bg-red-50 text-red-900"
                }`}
              >
                {formFeedback.message}
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
