"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Handshake,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { motion, useReducedMotion } from "motion/react";

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";

/* =========================================================
   TYPES
========================================================= */

type PartnerItem = {
  icon: ComponentType<{
    size?: number | string;
    className?: string;
  }>;
  name: string;
  category: string;
  type: string;
  logo?: string;
};

type ClientItem = {
  name: string;
  logo?: string;
};

/* =========================================================
   PARTENAIRES
========================================================= */

const partners: PartnerItem[] = [
  {
    icon: Building2,
    name: "EURL Chantier d’Algérie",
    category: "Bureau d’études",
    type: "Partenaire technique",
  },
  {
    icon: GraduationCap,
    name: "Institut de Génie Maritime d’Oran",
    category: "USTO Mohamed Boudiaf",
    type: "Partenaire académique",
  },
  {
    icon: GraduationCap,
    name: "Institut de Technologie des Pêches",
    category: "ITPA Oran",
    type: "Partenaire académique",
  },
  {
    icon: Building2,
    name: "Direction de la pêche d’Oran",
    category: "Institution publique",
    type: "Partenaire institutionnel",
  },
  {
    icon: Building2,
    name: "Direction de la pêche d’Aïn Témouchent",
    category: "Institution publique",
    type: "Partenaire institutionnel",
  },
  {
    icon: Building2,
    name: "Direction de la pêche de Mostaganem",
    category: "Institution publique",
    type: "Partenaire institutionnel",
  },
  {
    icon: Building2,
    name: "Direction de la pêche de Ghazaouet",
    category: "Institution publique",
    type: "Partenaire institutionnel",
  },
  {
    icon: Building2,
    name: "ENACT D’ORAN",
    category: "Entreprise nationale",
    type: "Partenaire technique",
  },
  {
    icon: ShieldCheck,
    name: "Protection civile",
    category: "Unité d’intervention au niveau du port d’Oran",
    type: "Partenaire opérationnel",
  },
  {
    icon: Users,
    name: "Ligue d’Oran FASSAS",
    category: "Organisation professionnelle",
    type: "Partenaire métier",
  },
  {
    icon: Users,
    name: "CSUO",
    category: "Club sportif universitaire d’Oran",
    type: "Partenaire associatif",
  },
];

/* =========================================================
   CLIENTS
========================================================= */

const clients: ClientItem[] = [
  {
    name: "EURL SOSIM",
  },
  {
    name: "MEDITRAM SPA",
  },
  {
    name: "ALMIYAH ETTILEMÇANIA SPA",
  },
  {
    name: "SARL EL OUKHOUWA",
  },
  {
    name: "SPE",
    logo: "/images/spe.png",
  },
  {
    name: "SEOR",
    logo: "/images/seor.png",
  },
  {
    name: "CIAR",
    logo: "/images/ciar.png",
  },
  {
    name: "Kahrama",
    logo: "/images/kahrama.png",
  },
  {
    name: "Hyflux",
    logo: "/images/hyflux.png",
  },
  {
    name: "SAA Assurances",
    logo: "/images/saa.png",
  },
  {
    name: "Cosider Travaux Publics",
    logo: "/images/cosider.png",
  },
  {
    name: "CAAT",
    logo: "/images/caat.png",
  },
  {
    name: "L’Algérienne des Assurances",
    logo: "/images/algerienne.png",
  },
  {
    name: "EPA Arzew",
    logo: "/images/epa.png",
  },
  {
    name: "GCB",
    logo: "/images/gcb.png",
  },
  {
    name: "Daewoo E&C",
  },
];

/* =========================================================
   STATISTIQUES
========================================================= */

const strengths = [
  {
    icon: Handshake,
    value: `${partners.length}+`,
    title: "Partenaires actifs",
    text: "Un réseau technique, académique et institutionnel solide.",
  },
  {
    icon: Building2,
    value: `${clients.length}+`,
    title: "Clients de référence",
    text: "Des entreprises nationales et internationales de premier plan.",
  },
  {
    icon: Network,
    value: "360°",
    title: "Approche collaborative",
    text: "Des expertises complémentaires mobilisées selon chaque projet.",
  },
];

/* =========================================================
   CARROUSEL DES LOGOS CLIENTS
========================================================= */

function ClientsLogoCarousel({ items }: { items: ClientItem[] }) {
  const reduceMotion = useReducedMotion();

  const logoClients = items.filter(
    (client): client is ClientItem & { logo: string } =>
      Boolean(client.logo)
  );

  const marqueeClients = [...logoClients, ...logoClients];

  return (
    <div
      className="clients-logo-carousel"
      aria-label="Logos de nos principaux clients"
    >
      <div className="clients-logo-carousel-fade clients-logo-carousel-fade-left" />
      <div className="clients-logo-carousel-fade clients-logo-carousel-fade-right" />

      <motion.div
        className="clients-logo-carousel-track"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 24,
                repeat: Infinity,
                ease: "linear",
              }
        }
      >
        {marqueeClients.map((client, index) => (
          <motion.div
            className="clients-logo-carousel-item"
            key={`${client.name}-${index}`}
            aria-hidden={index >= logoClients.length}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    scale: 1.1,
                    y: -4,
                  }
            }
            transition={{
              duration: 0.25,
            }}
          >
            <Image
              src={client.logo}
              alt={
                index < logoClients.length
                  ? `Logo ${client.name}`
                  : ""
              }
              width={190}
              height={90}
              sizes="(max-width: 600px) 135px, 190px"
              style={{
                width: "auto",
                height: "auto",
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* =========================================================
   PAGE PARTENAIRES
========================================================= */

export default function PartenairesPage() {
  return (
    <>
      {/* ===================================================
          HERO
      =================================================== */}

      <PageHero
        title="Partenaires et clients"
        description="Des collaborations solides avec des institutions, entreprises et acteurs du secteur maritime."
        image="/images/13.jpg"
        currentPage="Partenaires"
      />

      {/* ===================================================
          INTRODUCTION
      =================================================== */}

      <section className="partners-premium-intro">
        <div className="partners-premium-pattern" />
        <div className="partners-orbit partners-orbit-one" />
        <div className="partners-orbit partners-orbit-two" />

        <div className="container partners-premium-intro-grid">
          <Reveal className="partners-premium-intro-content">
            <span className="partners-premium-label">
              <Sparkles size={15} />
              Réseau professionnel
            </span>

            <h2>
              Des collaborations durables au service de projets exigeants
            </h2>

            <p>
              Farre Service s’appuie sur un réseau de partenaires
              techniques, institutionnels, académiques et opérationnels
              pour accompagner chaque mission avec précision,
              réactivité et expertise.
            </p>

            <div className="partners-premium-checks">
              <div>
                <CheckCircle2 />
                <span>Compétences complémentaires</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>
                  Coopération avec des institutions reconnues
                </span>
              </div>

              <div>
                <CheckCircle2 />
                <span>
                  Accompagnement adapté aux contraintes du terrain
                </span>
              </div>
            </div>

            <Link
              href="/contact"
              className="button button-primary button-lg"
            >
              Proposer une collaboration
              <ArrowRight size={18} />
            </Link>
          </Reveal>

          <Reveal
            className="partners-premium-visual"
            direction="right"
          >
            <div className="partners-premium-main-image">
              <Image
                src="/images/13.jpg"
                alt="Collaboration maritime Farre Service"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>

            <div className="partners-premium-small-image">
              <Image
                src="/images/12.jpg"
                alt="Partenariat technique maritime"
                fill
                sizes="260px"
              />
            </div>

            <div className="partners-premium-floating-card">
              <Handshake />

              <div>
                <strong>Partenariats solides</strong>

                <span>
                  Institutionnels, techniques et académiques
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================================================
          STATISTIQUES
      =================================================== */}

      <section className="partners-premium-stats">
        <div className="container partners-premium-stats-grid">
          {strengths.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal
                key={item.title}
                delay={index * 0.08}
              >
                <article className="partners-premium-stat-card">
                  <div className="partners-premium-stat-icon">
                    <Icon />
                  </div>

                  <div>
                    <strong>{item.value}</strong>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===================================================
          LISTE DES PARTENAIRES
      =================================================== */}

      <section className="partners-network-section">
        <div className="partners-network-glow partners-network-glow-one" />
        <div className="partners-network-glow partners-network-glow-two" />

        <div className="container">
          <Reveal className="partners-network-heading">
            <div>
              <span className="eyebrow eyebrow-light">
                Nos partenaires
              </span>

              <h2>
                Un réseau structuré autour de l’expertise maritime
              </h2>
            </div>

            <p>
              Des partenaires sélectionnés pour leur savoir-faire,
              leur connaissance du terrain et leur capacité à
              contribuer à des opérations complexes.
            </p>
          </Reveal>

          <div className="partners-premium-grid">
            {partners.map((partner, index) => {
              const Icon = partner.icon;

              return (
                <Reveal
                  key={partner.name}
                  delay={(index % 3) * 0.07}
                >
                  <article className="partners-premium-card">
                    <div className="partners-premium-card-top">
                      <div
                        className={`partners-premium-card-icon ${
                          partner.logo
                            ? "has-partner-logo"
                            : ""
                        }`}
                      >
                        {partner.logo ? (
                          <Image
                            src={partner.logo}
                            alt={`Logo ${partner.name}`}
                            width={110}
                            height={64}
                            className="partners-premium-card-logo"
                            style={{
                              width: "auto",
                              height: "auto",
                            }}
                          />
                        ) : (
                          <Icon />
                        )}
                      </div>

                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <span className="partners-premium-type">
                      {partner.type}
                    </span>

                    <h3>{partner.name}</h3>

                    <p>{partner.category}</p>

                    <div className="partners-premium-card-footer">
                      <span>Collaboration active</span>
                      <CheckCircle2 />
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================
          CLIENTS
      =================================================== */}

      <section className="clients-premium-section">
        <div className="clients-premium-pattern" />

        <div className="container">
          <Reveal className="clients-premium-heading">
            <div>
              <span className="eyebrow">
                Nos principaux clients
              </span>

              <h2 className="section-title">
                Des entreprises qui nous accordent leur confiance
              </h2>

              <p>
                Nous intervenons pour des acteurs industriels,
                portuaires, hydrauliques, assurantiels et de travaux
                publics.
              </p>
            </div>

            <div className="clients-premium-count">
              <Building2 />
              <strong>{clients.length}+</strong>
              <span>Clients de référence</span>
            </div>
          </Reveal>

          <ClientsLogoCarousel items={clients} />
        </div>
      </section>

      {/* ===================================================
          BANNIÈRE DE CONTACT
      =================================================== */}

      <section className="partnership-premium-banner">
        <Image
          src="/images/page3.png"
          alt="Partenariat maritime Farre Service"
          fill
          className="partnership-premium-image"
          sizes="100vw"
        />

        <div className="partnership-premium-overlay" />
        <div className="partnership-premium-grid" />

        <div className="container partnership-premium-content">
          <Reveal>
            <span className="partnership-premium-kicker">
              Construisons ensemble
            </span>

            <h2>
              Vous souhaitez collaborer avec Farre Service ?
            </h2>

            <p>
              Contactez-nous pour étudier une collaboration technique,
              institutionnelle ou commerciale adaptée à vos objectifs.
            </p>
          </Reveal>

          <Reveal
            className="partnership-premium-actions"
            direction="right"
          >
            <Link
              href="/contact"
              className="button button-primary button-lg"
            >
              Devenir partenaire
              <ArrowRight size={19} />
            </Link>

            <div className="partnership-premium-phones">
              <a
                href="tel:+213660952397"
                className="partnership-premium-phone"
                aria-label="Appeler Farre Service au 0660 95 23 97"
              >
                <span>Contact direct 1</span>
                <strong>0660 95 23 97</strong>
              </a>

              <a
                href="tel:+213697117917"
                className="partnership-premium-phone"
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