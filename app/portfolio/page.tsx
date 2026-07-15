import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  HardHat,
  MapPin,
  ShieldCheck,
  Waves,
} from "lucide-react";

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Découvrez les principales réalisations maritimes, portuaires, hydrauliques, industrielles et sous-marines de Farre Service.",
};

const projects = [
  {
    image: "/images/1.jpg",
    category: "Travaux hydrauliques",
    title:
      "Mise en place de pipelines au niveau d’une usine de production électrique",
    location: "M’Daourouch, wilaya d’Annaba",
  },
  {
    image: "/images/2.jpg",
    category: "Repêchage",
    title: "Repêchage d’une grue de 100 tonnes",
    location: "Barrage Sidi M’Hamed, wilaya de Relizane",
  },
  {
    image: "/images/3.jpg",
    category: "Construction maritime",
    title:
      "Réfection d’un brise-lames par coffrage sous-marin perdu pour le compte de GNL3Z",
    location: "Bethioua",
  },
  {
    image: "/images/4.jpg",
    category: "Inspection sous-marine",
    title:
      "Préparation de l’inspection sous-marine à l’intérieur et à l’extérieur du canal d’amenée de la station électrique TERGA",
    location: "Wilaya d’Aïn Témouchent",
  },
  {
    image: "/images/5.jpg",
    category: "Travaux portuaires",
    title: "Pose de caissons en béton",
    location: "Port d’Arzew",
  },
  {
    image: "/images/6.jpg",
    category: "Conduites PEHD",
    title:
      "Installation et montage de conduites en PEHD de 2 000 mm de diamètre au niveau de SONACTEL, pour le compte de Samsung",
    location: "Wilaya de Mostaganem",
  },
  {
    image: "/images/7.jpg",
    category: "Balisage maritime",
    title:
      "Fixation des balises de signalisation maritime pour une usine d’ammoniac",
    location: "Mers El Hadjadj, wilaya d’Oran",
  },
  {
    image: "/images/8.jpg",
    category: "Maintenance industrielle",
    title:
      "Maintenance et fixation des protections anodiques et des garde-corps au niveau de l’usine AOA",
    location: "Mers El Hadjadj, wilaya d’Oran",
  },
  {
    image: "/images/9.jpg",
    category: "Soudure et découpage",
    title:
      "Découpage et soudure des pieux du pont de chargement pour l’usine AOA",
    location: "Mers El Hadjadj, wilaya d’Oran",
  },
  {
    image: "/images/10.jpg",
    category: "Nettoyage sous-marin",
    title:
      "Grattage et nettoyage du bassin de captage de la station de dessalement de Beni Saf",
    location: "Beni Saf, wilaya d’Aïn Témouchent",
  },
  {
    image: "/images/11.jpg",
    category: "Soudure sous-marine",
    title: "Travaux de soudure sous-marine au niveau du bassin GNL2-Z",
    location: "Bethioua",
  },
  {
    image: "/images/12.jpg",
    category: "Aquaculture",
    title:
      "Installation de cages flottantes destinées à l’élevage de poissons",
    location: "Site aquacole",
  },
  {
    image: "/images/13.jpg",
    category: "Travaux offshore",
    title:
      "Travaux offshore STH avec intervention en plongée profonde à 70 mètres",
    location: "Zone offshore",
  },
  {
    image: "/images/14.jpg",
    category: "Protection portuaire",
    title:
      "Mise en place de blocs de protection au niveau du quai de service",
    location: "Port d’Oran",
  },
  {
    image: "/images/15.jpg",
    category: "Travaux hydrauliques",
    title:
      "Réparation du canal de rejet de la station de dessalement d’El Mactaa, d’une capacité de 500 000 m³ par jour",
    location: "El Mactaa, wilaya d’Oran",
  },
  {
    image: "/images/16.jpg",
    category: "Inspection navale",
    title:
      "Inspection sous-marine d’un navire de Hyproc Shipping Company",
    location: "En mer",
  },
  {
    image: "/images/17.jpg",
    category: "Maintenance industrielle",
    title:
      "Changement des filtres en amont des pompes pour l’usine Tosyali Algérie",
    location: "Site industriel Tosyali Algérie",
  },
  {
    image: "/images/18.jpg",
    category: "Maintenance électrique",
    title:
      "Travaux de maintenance au niveau de la station électrique TERGA",
    location: "Wilaya d’Aïn Témouchent",
  },
  {
    image: "/images/19.jpg",
    category: "Maintenance offshore",
    title:
      "Maintenance des conduites offshore en PEHD dans la zone de stockage",
    location: "Port d’Arzew",
  }
 
];

const statistics = [
  {
    icon: Camera,
    value: "20",
    title: "Réalisations présentées",
    text: "Une sélection d’interventions menées dans différents environnements.",
  },
  {
    icon: Waves,
    value: "10+",
    title: "Domaines techniques",
    text: "Inspection, maintenance, soudure, hydraulique, offshore et portuaire.",
  },
  {
    icon: ShieldCheck,
    value: "Terrain",
    title: "Expertise opérationnelle",
    text: "Des interventions préparées selon les contraintes de chaque site.",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        title="Notre portfolio"
        description="Découvrez en images quelques travaux et interventions réalisés par les équipes de Farre Service."
        image="/images/16.jpg"
        currentPage="Portfolio"
      />

      {/* Introduction */}

      <section className="portfolio-premium-intro">
        <div className="portfolio-premium-pattern" />

        <div className="container portfolio-premium-intro-grid">
          <Reveal className="portfolio-premium-intro-content">
            <span className="portfolio-premium-label">
              <Camera size={15} />
              Réalisations terrain
            </span>

            <h2>Une expertise visible à travers des projets concrets</h2>

            <p>
              Découvrez une sélection d’interventions menées par Farre Service
              dans les domaines maritimes, portuaires, hydrauliques,
              industriels et sous-marins.
            </p>

            <div className="portfolio-premium-checks">
              <div>
                <CheckCircle2 />
                <span>Interventions sur des sites complexes</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Équipes techniques spécialisées</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Moyens adaptés à chaque environnement</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="button button-primary button-lg"
            >
              Étudier votre projet
              <ArrowRight size={18} />
            </Link>
          </Reveal>

          <Reveal
            className="portfolio-premium-visual"
            direction="right"
          >
            <div
              className="portfolio-premium-main-image"
              style={{
                position: "absolute",
                overflow: "hidden",
              }}
            >
              <Image
                src="/images/13.jpg"
                alt="Travaux offshore réalisés par Farre Service"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div
              className="portfolio-premium-small-image"
              style={{
                position: "absolute",
                width: "255px",
                height: "300px",
                overflow: "hidden",
              }}
            >
              <Image
                src="/images/9.jpg"
                alt="Travaux de soudure et de découpage sous-marins"
                fill
                sizes="260px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="portfolio-premium-floating-card">
              <HardHat />

              <div>
                <strong>Expertise opérationnelle</strong>
                <span>Sur terre, en port et sous l’eau</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Statistiques */}

      <section className="portfolio-premium-stats">
        <div className="container portfolio-premium-stats-grid">
          {statistics.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <article className="portfolio-premium-stat-card">
                  <div className="portfolio-premium-stat-icon">
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

      {/* Galerie */}

      <section className="portfolio-gallery-section">
        <div className="portfolio-gallery-glow portfolio-gallery-glow-one" />
        <div className="portfolio-gallery-glow portfolio-gallery-glow-two" />

        <div className="container">
          <Reveal className="portfolio-gallery-heading">
            <div>
              <span className="eyebrow eyebrow-light">
                Notre galerie
              </span>

              <h2>
                Des réalisations dans des environnements exigeants
              </h2>
            </div>

            <p>
              Inspection, maintenance, soudure, nettoyage, installation de
              conduites, travaux portuaires et opérations offshore.
            </p>
          </Reveal>

          <div className="portfolio-premium-grid">
            {projects.map((project, index) => {
              const wide = index === 0 || index === 7 || index === 14;
              const tall = index === 4 || index === 11;

              return (
                <Reveal
                  key={`${project.title}-${project.image}`}
                  delay={(index % 3) * 0.06}
                  className={[
                    "portfolio-premium-item",
                    wide ? "portfolio-premium-item-wide" : "",
                    tall ? "portfolio-premium-item-tall" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <article
                    className="portfolio-premium-card"
                    style={{
                      position: "relative",
                      height: "100%",
                      minHeight: "390px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title} — ${project.location}`}
                      fill
                      sizes={
                        wide
                          ? "(max-width: 900px) 100vw, 66vw"
                          : "(max-width: 900px) 100vw, 33vw"
                      }
                      style={{ objectFit: "cover" }}
                    />

                    <div className="portfolio-premium-overlay" />
                    <div className="portfolio-premium-gradient" />

                    <span className="portfolio-premium-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="portfolio-premium-content">
                      <span className="portfolio-premium-category">
                        {project.category}
                      </span>

                      <h3>{project.title}</h3>

                      <p className="portfolio-premium-location">
                        <MapPin />
                        <span>{project.location}</span>
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Appel à l’action */}

      <section
        className="portfolio-final-cta"
        style={{
          position: "relative",
          minHeight: "590px",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/page3.png"
          alt="Intervention sous-marine spécialisée de Farre Service"
          fill
          className="portfolio-final-cta-image"
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />

        <div className="portfolio-final-cta-overlay" />
        <div className="portfolio-final-cta-grid" />

        <div className="container portfolio-final-cta-content">
          <Reveal>
            <span className="portfolio-final-cta-kicker">
              Votre prochaine intervention
            </span>

            <h2>
              Besoin d’une équipe pour un projet spécialisé ?
            </h2>

            <p>
              Décrivez-nous votre besoin ainsi que les caractéristiques de
              votre site. Notre équipe vous proposera une solution adaptée.
            </p>
          </Reveal>

          <Reveal
            className="portfolio-final-cta-actions"
            direction="right"
          >
            <Link
              href="/contact"
              className="button button-primary button-lg"
            >
              Parler à notre équipe
              <ArrowRight size={19} />
            </Link>

            <a
              href="tel:+213660952397"
              className="portfolio-final-cta-phone"
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