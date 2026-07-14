import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Construction,
  Droplets,
  HardHat,
  LifeBuoy,
  Ruler,
  Search,
  ShieldCheck,
  Sparkles,
  Waves,
  Wrench,
} from "lucide-react";

import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Inspection, maintenance, soudure, nettoyage et travaux hydrauliques sous-marins.",
};

const services = [
  {
    number: "01",
    icon: Camera,
    title: "Inspections sous-marines",
    shortTitle: "Inspection",
    description:
      "Contrôle visuel, photographique et technique des ouvrages, équipements et installations immergés.",
    image: "/images/6.jpg",
    items: [
      "Installations hydro-techniques",
      "Ports, bassins et ouvrages maritimes",
      "Galeries et conduites immergées",
      "Carènes, hélices et navires",
      "Captures photo et vidéo",
      "Relevés et rapports techniques",
    ],
  },
  {
    number: "02",
    icon: Wrench,
    title: "Nettoyage et maintenance",
    shortTitle: "Maintenance",
    description:
      "Entretien préventif et curatif des ouvrages immergés et des circuits hydrauliques.",
    image: "/images/18.jpg",
    items: [
      "Nettoyage et dévasement",
      "Entretien des ouvrages immergés",
      "Nettoyage des galeries noyées",
      "Entretien des pomperies",
      "Grattage des structures",
      "Maintenance préventive",
    ],
  },
  {
    number: "03",
    icon: Anchor,
    title: "Entretien portuaire",
    shortTitle: "Portuaire",
    description:
      "Interventions spécialisées sur les infrastructures portuaires, les quais et les équipements maritimes.",
    image: "/images/12.jpg",
    items: [
      "Balisage maritime",
      "Pose de blocs",
      "Entretien des quais",
      "Colmatage des cavités",
      "Protection cathodique",
      "Installation de défenses",
    ],
  },
  {
    number: "04",
    icon: HardHat,
    title: "Soudure et découpage",
    shortTitle: "Construction",
    description:
      "Construction, assemblage et réparation de structures métalliques en environnement immergé.",
    image: "/images/9.jpg",
    items: [
      "Soudure sous-marine",
      "Découpage métallique",
      "Chemisage des pieux",
      "Pose d’anodes",
      "Assemblage de structures",
      "Réparation de pieux",
    ],
  },
  {
    number: "05",
    icon: Droplets,
    title: "Travaux hydrauliques",
    shortTitle: "Hydraulique",
    description:
      "Pose, maintenance et réparation de conduites et de réseaux hydrauliques complexes.",
    image: "/images/15.jpg",
    items: [
      "Pose de conduites",
      "Conduites offshore",
      "Réparation des prises d’eau",
      "Réparation des canaux",
      "Installation de conduites PEHD",
      "Maintenance des réseaux",
    ],
  },
  {
    number: "06",
    icon: Construction,
    title: "Assistance technique",
    shortTitle: "Assistance",
    description:
      "Mise à disposition de moyens humains et techniques pour les opérations maritimes particulières.",
    image: "/images/3.jpg",
    items: [
      "Inspection des navires",
      "Renflouage",
      "Recherche d’objets",
      "Récupération de matériels",
      "Personnel spécialisé en régie",
      "Assistance aux travaux de digues",
    ],
  },
];

const process = [
  {
    number: "01",
    icon: Search,
    title: "Analyse du besoin",
    text: "Étude de la mission, du site, des accès et des contraintes techniques.",
  },
  {
    number: "02",
    icon: Ruler,
    title: "Préparation technique",
    text: "Définition des procédures, des équipements et des moyens humains adaptés.",
  },
  {
    number: "03",
    icon: LifeBuoy,
    title: "Intervention sécurisée",
    text: "Réalisation de l’opération selon un protocole rigoureux et maîtrisé.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Rapport de mission",
    text: "Transmission des observations, photos, vidéos et recommandations.",
  },
];

const advantages = [
  {
    icon: ShieldCheck,
    value: "100%",
    title: "Sécurité maîtrisée",
    text: "Des procédures adaptées à chaque environnement d’intervention.",
  },
  {
    icon: Waves,
    value: "80 m",
    title: "Capacité d’intervention",
    text: "Des moyens adaptés aux opérations en milieux maritimes complexes.",
  },
  {
    icon: HardHat,
    value: "24/7",
    title: "Équipe opérationnelle",
    text: "Une mobilisation rapide selon les contraintes et urgences du projet.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Nos services"
        description="Une expertise complète pour les opérations maritimes, portuaires, hydrauliques et sous-marines."
        image="/images/4.jpg"
        currentPage="Services"
      />

      {/* Introduction */}

      <section className="services-intro-premium">
        <div className="services-intro-pattern" />

        <div className="container services-intro-premium-grid">
          <Reveal className="services-intro-premium-content">
            <span className="services-premium-label">
              <Sparkles size={15} />
              Expertise maritime
            </span>

            <h2>
              Des solutions techniques pour les environnements les plus
              exigeants
            </h2>

            <p>
              Farre Service accompagne les acteurs industriels, portuaires et
              hydrauliques dans la préparation et la réalisation de leurs
              opérations sous-marines.
            </p>

            <div className="services-intro-checks">
              <div>
                <Check />
                <span>Équipes techniques spécialisées</span>
              </div>

              <div>
                <Check />
                <span>Préparation rigoureuse des opérations</span>
              </div>

              <div>
                <Check />
                <span>Équipements adaptés aux environnements immergés</span>
              </div>

              <div>
                <Check />
                <span>Rapports photo et vidéo selon les missions</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="button button-primary button-lg"
            >
              Étudier votre besoin
              <ArrowRight size={18} />
            </Link>
          </Reveal>

          <Reveal
            className="services-intro-premium-visual"
            direction="right"
          >
            <div className="services-intro-main-image">
              <Image
                src="/images/2.jpg"
                alt="Intervention maritime Farre Service"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>

            <div className="services-intro-small-image">
              <Image
                src="/images/7.jpg"
                alt="Travaux sous-marins professionnels"
                fill
                sizes="270px"
              />
            </div>

            <div className="services-intro-floating-card">
              <Waves />
              <div>
                <strong>Expertise terrain</strong>
                <span>Maritime et sous-marine</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}

      <section className="services-showcase">
        <div className="services-showcase-glow services-showcase-glow-one" />
        <div className="services-showcase-glow services-showcase-glow-two" />

        <div className="container">
          <Reveal className="services-showcase-heading">
            <div>
              <span className="eyebrow eyebrow-light">Nos domaines</span>

              <h2>
                Une expertise complète au service de vos opérations
              </h2>
            </div>

            <p>
              Chaque intervention est préparée selon les caractéristiques du
              site, les contraintes techniques et les objectifs de la mission.
            </p>
          </Reveal>

          <div className="services-showcase-grid">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal
                  key={service.title}
                  delay={(index % 3) * 0.08}
                  className={
                    index === 0 || index === 5
                      ? "services-showcase-item services-showcase-item-wide"
                      : "services-showcase-item"
                  }
                >
                  <article className="services-showcase-card">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes={
                        index === 0 || index === 5
                          ? "(max-width: 900px) 100vw, 66vw"
                          : "(max-width: 900px) 100vw, 33vw"
                      }
                    />

                    <div className="services-showcase-overlay" />
                    <div className="services-showcase-gradient" />

                    <span className="services-showcase-number">
                      {service.number}
                    </span>

                    <div className="services-showcase-content">
                      <div className="services-showcase-icon">
                        <Icon />
                      </div>

                      <span className="services-showcase-category">
                        {service.shortTitle}
                      </span>

                      <h3>{service.title}</h3>
                      <p>{service.description}</p>

                      <div className="services-showcase-list">
                        {service.items.slice(0, 4).map((item) => (
                          <div key={item}>
                            <CheckCircle2 />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <Link href="/contact">
                        Demander une intervention
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Avantages */}

      <section className="services-advantages">
        <div className="container services-advantages-grid">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;

            return (
              <Reveal key={advantage.title} delay={index * 0.09}>
                <article className="services-advantage-card">
                  <div className="services-advantage-icon">
                    <Icon />
                  </div>

                  <div>
                    <strong>{advantage.value}</strong>
                    <h3>{advantage.title}</h3>
                    <p>{advantage.text}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Processus */}

      <section className="services-process-premium">
        <div className="container">
          <Reveal className="centered services-process-heading">
            <span className="eyebrow">Notre méthode</span>

            <h2 className="section-title">
              Une organisation rigoureuse pour chaque intervention
            </h2>

            <p>
              De l’analyse initiale jusqu’au rapport final, chaque étape est
              préparée afin de garantir efficacité, sécurité et précision.
            </p>
          </Reveal>

          <div className="services-process-grid">
            <div className="services-process-line" />

            {process.map((step, index) => {
              const Icon = step.icon;

              return (
                <Reveal key={step.title} delay={index * 0.1}>
                  <article className="services-process-card">
                    <div className="services-process-number">
                      {step.number}
                    </div>

                    <div className="services-process-icon">
                      <Icon />
                    </div>

                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="services-final-cta">
        <Image
          src="/images/page3.png"
          alt="Intervention sous-marine professionnelle"
          fill
          className="services-final-cta-image"
          sizes="100vw"
        />

        <div className="services-final-cta-overlay" />
        <div className="services-final-cta-pattern" />

        <div className="container services-final-cta-content">
          <Reveal>
            <span className="services-final-cta-label">
              Projet maritime ou sous-marin
            </span>

            <h2>
              Une intervention à préparer ?
              <span> Parlons de votre projet.</span>
            </h2>

            <p>
              Présentez-nous vos contraintes techniques. Notre équipe vous
              proposera une solution adaptée à votre site et à vos objectifs.
            </p>
          </Reveal>

          <Reveal
            className="services-final-cta-actions"
            direction="right"
          >
            <Link
              href="/contact"
              className="button button-primary button-lg"
            >
              Demander un devis
              <ArrowRight size={19} />
            </Link>

            <a
              href="tel:+213660952397"
              className="services-final-cta-phone"
            >
              <span>Contact direct</span>
              <strong>0660 952 397</strong>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}