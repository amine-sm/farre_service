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

import {
  getProjectImageUrl,
  getProjects,
  toBoolean,
} from "../../lib/api/projects";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Découvrez les principales réalisations maritimes, portuaires, hydrauliques, industrielles et sous-marines de Farre Service.",
};

export default async function PortfolioPage() {
  /*
   * Les données sont maintenant chargées depuis :
   * Next.js -> Express -> MySQL
   */
  const projects = await getProjects();

  const numberOfCategories = new Set(
    projects
      .map((project) => project.category)
      .filter(Boolean)
  ).size;

  const statistics = [
    {
      icon: Camera,
      value: String(projects.length),
      title: "Réalisations présentées",
      text: "Une sélection d’interventions menées dans différents environnements.",
    },
    {
      icon: Waves,
      value: String(numberOfCategories),
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

            <h2>
              Une expertise visible à travers des projets
              concrets
            </h2>

            <p>
              Découvrez une sélection d’interventions menées
              par Farre Service dans les domaines maritimes,
              portuaires, hydrauliques, industriels et
              sous-marins.
            </p>

            <div className="portfolio-premium-checks">
              <div>
                <CheckCircle2 />

                <span>
                  Interventions sur des sites complexes
                </span>
              </div>

              <div>
                <CheckCircle2 />

                <span>
                  Équipes techniques spécialisées
                </span>
              </div>

              <div>
                <CheckCircle2 />

                <span>
                  Moyens adaptés à chaque environnement
                </span>
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
                style={{
                  objectFit: "cover",
                }}
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
                style={{
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="portfolio-premium-floating-card">
              <HardHat />

              <div>
                <strong>
                  Expertise opérationnelle
                </strong>

                <span>
                  Sur terre, en port et sous l’eau
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Statistiques dynamiques */}

      <section className="portfolio-premium-stats">
        <div className="container portfolio-premium-stats-grid">
          {statistics.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal
                key={item.title}
                delay={index * 0.08}
              >
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

      {/* Galerie dynamique */}

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
                Des réalisations dans des environnements
                exigeants
              </h2>
            </div>

            <p>
              Inspection, maintenance, soudure, nettoyage,
              installation de conduites, travaux portuaires
              et opérations offshore.
            </p>
          </Reveal>

          {projects.length === 0 ? (
            <div className="portfolio-empty-state">
              <Camera size={45} />

              <h3>
                Aucune réalisation disponible
              </h3>

              <p>
                Ajoutez des travaux depuis la page
                d’administration.
              </p>
            </div>
          ) : (
            <div className="portfolio-premium-grid">
              {projects.map((project, index) => {
                const wide = toBoolean(
                  project.isWide
                );

                const tall = toBoolean(
                  project.isTall
                );

                const imageUrl =
                  getProjectImageUrl(project.image);

                return (
                  <Reveal
                    key={project.id}
                    delay={(index % 3) * 0.06}
                    className={[
                      "portfolio-premium-item",
                      wide
                        ? "portfolio-premium-item-wide"
                        : "",
                      tall
                        ? "portfolio-premium-item-tall"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <article
                      className="portfolio-premium-card"
                      style={{
                        position: "relative",
                        height: "100%",
                        minHeight: tall
                          ? "520px"
                          : "390px",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${project.title} — ${
                          project.location ||
                          "Farre Service"
                        }`}
                        fill
                        sizes={
                          wide
                            ? "(max-width: 900px) 100vw, 66vw"
                            : "(max-width: 900px) 100vw, 33vw"
                        }
                        style={{
                          objectFit: "cover",
                        }}
                      />

                      <div className="portfolio-premium-overlay" />
                      <div className="portfolio-premium-gradient" />

                      <span className="portfolio-premium-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div className="portfolio-premium-content">
                        <span className="portfolio-premium-category">
                          {project.category}
                        </span>

                        <h3>{project.title}</h3>

                        {project.description && (
                          <p className="portfolio-project-description">
                            {project.description}
                          </p>
                        )}

                        {project.location && (
                          <p className="portfolio-premium-location">
                            <MapPin />

                            <span>
                              {project.location}
                            </span>
                          </p>
                        )}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
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
          style={{
            objectFit: "cover",
          }}
        />

        <div className="portfolio-final-cta-overlay" />
        <div className="portfolio-final-cta-grid" />

        <div className="container portfolio-final-cta-content">
          <Reveal>
            <span className="portfolio-final-cta-kicker">
              Votre prochaine intervention
            </span>

            <h2>
              Besoin d’une équipe pour un projet
              spécialisé ?
            </h2>

            <p>
              Décrivez-nous votre besoin ainsi que les
              caractéristiques de votre site. Notre équipe
              vous proposera une solution adaptée.
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