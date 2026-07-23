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

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Inspection, maintenance, soudure, nettoyage, travaux portuaires, hydrauliques et sous-marins en Algérie.",
};

const services = [
  {
    number: "A",
    icon: Camera,
    title: "Inspections sous-marines",
    shortTitle: "Inspection",
    description:
      "Contrôle visuel, photographique, vidéo et technique des installations, ouvrages et équipements immergés.",
    image: "/images/6.jpg",
    items: [
      "Inspection sous-marine des installations hydrotechniques",
      "Inspection des balises de signalisation maritime",
      "Inspection sous-marine des ouvrages immergés : ports, bassins et quais",
      "Inspection des galeries et conduites d’amenée d’eau de mer",
      "Inspection des éléments immergés des navires : carène, gouvernail et hélice",
      "Contrôle de la protection cathodique",
      "Inspection des prises d’eau de mer",
      "Inspection à sec de tous types de navires",
      "Prises de vues photographiques et vidéos sous l’eau",
      "Sondage et relevé bathymétrique",
    ],
  },
  {
    number: "B1",
    icon: Wrench,
    title: "Nettoyage et travaux de structure",
    shortTitle: "Maintenance",
    description:
      "Nettoyage, dévasement, entretien et remise en état des structures, bassins, pomperies et circuits immergés.",
    image: "/images/18.jpg",
    items: [
      "Travaux de nettoyage et de dévasement sous-marin",
      "Nettoyage et entretien des ouvrages immergés",
      "Nettoyage et entretien du système d’amenée d’eau de mer",
      "Entretien des galeries, bassins, pomperies, canaux et conduites",
      "Travaux d’assemblage sous-marins",
      "Grattage et nettoyage des structures immergées",
      "Maintenance préventive et corrective",
    ],
  },
  {
    number: "B2",
    icon: Anchor,
    title: "Entretien portuaire",
    shortTitle: "Portuaire",
    description:
      "Interventions spécialisées sur les plateformes, cavités, protections et équipements des ports et quais.",
    image: "/images/12.jpg",
    items: [
      "Balisage maritime",
      "Tirage et déplacement de plateformes",
      "Entretien et colmatage des cavernes et cavités",
      "Pose de blocs de protection",
      "Suivi de l’état de la protection cathodique",
      "Entretien des quais et infrastructures portuaires",
      "Installation et entretien des défenses portuaires",
    ],
  },
  {
    number: "B3",
    icon: HardHat,
    title: "Soudure et découpage sous-marins",
    shortTitle: "Soudure",
    description:
      "Réparation, chemisage, découpage et fixation de structures métalliques dans les environnements immergés.",
    image: "/images/9.jpg",
    items: [
      "Soudure sous-marine",
      "Découpage métallique sous-marin",
      "Chemisage des pieux",
      "Réparation et renforcement des pieux",
      "Pose d’anodes par soudure ou fixation",
      "Assemblage de structures métalliques",
      "Réparation de structures immergées",
      "Travaux de fixation sous-marine",
    ],
  },
  {
    number: "B4",
    icon: LifeBuoy,
    title: "Assistance technique maritime",
    shortTitle: "Assistance",
    description:
      "Assistance aux navires et aux opérations particulières nécessitant des plongeurs et des moyens spécialisés.",
    image: "/images/3.jpg",
    items: [
      "Inspection des œuvres vives de tous types de navires",
      "Intervention sur navires marchands et navires à passagers",
      "Renflouage par pompage ou structure gonflable",
      "Recherche, repérage et récupération d’objets divers",
      "Assistance aux travaux maritimes et portuaires",
      "Mise à disposition de moyens humains et techniques",
    ],
  },
  {
    number: "B5",
    icon: Construction,
    title: "Construction et protection des digues",
    shortTitle: "Digues",
    description:
      "Travaux d’assistance à la construction, à la stabilisation et à la protection des digues et ouvrages côtiers.",
    image: "/images/10.jpg",
    items: [
      "Pose de géotextile pour la construction des digues",
      "Assistance technique à la mise en place des protections",
      "Pose de blocs et éléments de protection",
      "Préparation et contrôle des zones immergées",
      "Intervention sur ouvrages côtiers et maritimes",
    ],
  },
  {
    number: "B6",
    icon: Droplets,
    title: "Travaux hydrauliques",
    shortTitle: "Hydraulique",
    description:
      "Pose, contrôle, maintenance et réparation de conduites et réseaux hydrauliques de différents diamètres.",
    image: "/images/15.jpg",
    items: [
      "Pose de conduites de différents diamètres",
      "Installation et maintenance de conduites offshore",
      "Installation de conduites PEHD",
      "Réparation des conduites de chlore et d’air",
      "Réparation des prises d’eau et des canaux",
      "Maintenance des réseaux hydrauliques",
      "Contrôle des conduites immergées",
    ],
  },
  {
    number: "B7",
    icon: Sparkles,
    title: "Travaux divers et mise à disposition",
    shortTitle: "Travaux divers",
    description:
      "Prestations complémentaires réalisées selon les contraintes du chantier et les besoins spécifiques du client.",
    image: "/images/17.jpg",
    items: [
      "Réalisation de prélèvements solides et liquides",
      "Travaux de sablage",
      "Autres travaux sous-marins spécialisés",
      "Location de personnel spécialisé en régie",
      "Mise à disposition de plongeurs professionnels",
      "Mise à disposition de matériel et moyens techniques",
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
    value: "< 80 m",
    title: "Capacité d’intervention",
    text: "Des moyens adaptés aux opérations sous-marines et maritimes complexes.",
  },
  {
    icon: HardHat,
    value: "Sur mesure",
    title: "Équipe opérationnelle",
    text: "Des moyens humains et techniques mobilisés selon les contraintes du projet.",
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
              Farre Service accompagne les acteurs industriels, portuaires,
              maritimes et hydrauliques dans la préparation et la réalisation
              de leurs opérations sous-marines.
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
                <span>
                  Équipements adaptés aux environnements immergés
                </span>
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

          <div className="services-hierarchy">
            {/* A — Inspection sous-marine */}
            {(() => {
              const service = services[0];
              const Icon = service.icon;

              return (
                <Reveal className="services-group-a">
                  <div className="services-group-heading">
                    <span className="services-group-letter">A</span>

                    <div>
                      <span>Travaux et services</span>
                      <h3>Inspections sous-marines</h3>
                    </div>
                  </div>

                  <article className="services-showcase-card services-showcase-card-featured">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 100vw"
                    />

                    <div className="services-showcase-overlay" />
                    <div className="services-showcase-gradient" />

                    <span className="services-showcase-number">
                      A
                    </span>

                    <div className="services-showcase-content">
                      <div className="services-showcase-icon">
                        <Icon />
                      </div>

                      <span className="services-showcase-category">
                        Inspection
                      </span>

                      <h3>{service.title}</h3>

                      <p>{service.description}</p>

                      <div className="services-showcase-list">
                        {service.items.map((item) => (
                          <div key={item}>
                            <CheckCircle2 />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <Link href="/contact">
                        Demander une inspection
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })()}

            {/* B — Travaux de maintenance */}
            <div className="services-group-b">
              <Reveal className="services-group-heading services-group-heading-b">
                <span className="services-group-letter">B</span>

                <div>
                  <span>Travaux de maintenance</span>

                  <h3>
                    Sept domaines d’intervention spécialisés
                  </h3>
                </div>
              </Reveal>

              <div className="services-showcase-grid services-showcase-grid-b">
                {services.slice(1).map((service, index) => {
                  const Icon = service.icon;

                  return (
                    <Reveal
                      key={service.title}
                      delay={(index % 3) * 0.08}
                      className="services-showcase-item"
                    >
                      <article className="services-showcase-card">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 900px) 100vw, 33vw"
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
                            {service.items.map((item) => (
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

      {/* CTA finale */}
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

            <div className="services-final-cta-phones">
              <a
                href="tel:+213660952397"
                className="services-final-cta-phone"
                aria-label="Appeler Farre Service au 0660 95 23 97"
              >
                <span>Contact direct 1</span>
                <strong>0660 95 23 97</strong>
              </a>

              <a
                href="tel:+213697117917"
                className="services-final-cta-phone"
                aria-label="Appeler Farre Service au 0697 11 79 17"
              >
                <span>Contact direct 2</span>
                <strong>0697 11 79 17</strong>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}