import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "Partenaires et clients",
  description:
    "Découvrez les partenaires institutionnels, techniques et commerciaux d’EURL Farre Service.",
};

const partners = [
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
    icon: ShieldCheck,
    name: "Protection civile",
    category: "Unité du port d’Oran",
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

const clients = [
  "EURL SOSIM",
  "MEDITRAM SPA",
  "ALMIYAH ETTILEMÇANIA SPA",
  "SARL EL OUKHOUWA",
  "SPE",
  "SEOR",
  "CIAR",
  "Kahrama",
  "Hyflux",
  "SAA Assurances",
  "Cosider Travaux Publics",
  "CAAT",
  "EPA Arzew",
  "GCB",
  "Daewoo E&C",
];

const strengths = [
  {
    icon: Handshake,
    value: "10+",
    title: "Partenaires actifs",
    text: "Un réseau technique, académique et institutionnel solide.",
  },
  {
    icon: Building2,
    value: "15+",
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

export default function PartenairesPage() {
  return (
    <>
      <PageHero
        title="Partenaires et clients"
        description="Des collaborations solides avec des institutions, entreprises et acteurs du secteur maritime."
        image="/images/13.jpg"
        currentPage="Partenaires"
      />

      <section className="partners-premium-intro">
        <div className="partners-premium-pattern" />

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
              Farre Service s’appuie sur un réseau de partenaires techniques,
              institutionnels, académiques et opérationnels pour accompagner
              chaque mission avec précision, réactivité et expertise.
            </p>

            <div className="partners-premium-checks">
              <div>
                <CheckCircle2 />
                <span>Compétences complémentaires</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Coopération avec des institutions reconnues</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Accompagnement adapté aux contraintes du terrain</span>
              </div>
            </div>

            <Link href="/contact" className="button button-primary button-lg">
              Proposer une collaboration
              <ArrowRight size={18} />
            </Link>
          </Reveal>

          <Reveal className="partners-premium-visual" direction="right">
            <div className="partners-premium-main-image">
              <Image
                src="/images/13.jpg"
                alt="Collaboration maritime Farre Service"
                fill
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
                <span>Institutionnels, techniques et académiques</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="partners-premium-stats">
        <div className="container partners-premium-stats-grid">
          {strengths.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={index * 0.08}>
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

      <section className="partners-network-section">
        <div className="partners-network-glow partners-network-glow-one" />
        <div className="partners-network-glow partners-network-glow-two" />

        <div className="container">
          <Reveal className="partners-network-heading">
            <div>
              <span className="eyebrow eyebrow-light">Nos partenaires</span>

              <h2>
                Un réseau structuré autour de l’expertise maritime
              </h2>
            </div>

            <p>
              Des partenaires sélectionnés pour leur savoir-faire, leur
              connaissance du terrain et leur capacité à contribuer à des
              opérations complexes.
            </p>
          </Reveal>

          <div className="partners-premium-grid">
            {partners.map((partner, index) => {
              const Icon = partner.icon;

              return (
                <Reveal key={partner.name} delay={(index % 3) * 0.07}>
                  <article className="partners-premium-card">
                    <div className="partners-premium-card-top">
                      <div className="partners-premium-card-icon">
                        <Icon />
                      </div>

                      <span>{String(index + 1).padStart(2, "0")}</span>
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

      <section className="clients-premium-section">
        <div className="clients-premium-pattern" />

        <div className="container">
          <Reveal className="clients-premium-heading">
            <div>
              <span className="eyebrow">Nos principaux clients</span>

              <h2 className="section-title">
                Des entreprises qui nous accordent leur confiance
              </h2>

              <p>
                Nous intervenons pour des acteurs industriels, portuaires,
                hydrauliques, assurantiels et de travaux publics.
              </p>
            </div>

            <div className="clients-premium-count">
              <Building2 />
              <strong>15+</strong>
              <span>Clients de référence</span>
            </div>
          </Reveal>

          <div className="clients-premium-grid">
            {clients.map((client, index) => (
              <Reveal key={client} delay={(index % 5) * 0.05}>
                <article className="clients-premium-card">
                  <div className="clients-premium-card-icon">
                    <Building2 />
                  </div>

                  <span>{client}</span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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

          <Reveal className="partnership-premium-actions" direction="right">
            <Link href="/contact" className="button button-primary button-lg">
              Devenir partenaire
              <ArrowRight size={19} />
            </Link>

            <a href="tel:+213660952397" className="partnership-premium-phone">
              <span>Contact direct</span>
              <strong>0660 952 397</strong>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
