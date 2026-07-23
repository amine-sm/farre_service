import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Camera,
  CheckCircle2,
  HardHat,
  ShieldCheck,
  Waves,
} from "lucide-react";

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import ProjectGallery from "../components/ProjectGallery";

import {
  getProjectImageUrl,
  getProjects,
  toBoolean,
  type Project,
} from "../../lib/api/projects";

/*
 * Cette page doit toujours charger les projets
 * les plus récents depuis Express/MySQL.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Découvrez les principales réalisations maritimes, portuaires, hydrauliques, industrielles et sous-marines de Farre Service.",
};

/**
 * Nettoie une chaîne provenant de l’API.
 */
function getSafeText(
  value: string | null | undefined,
  defaultValue = ""
): string {
  if (typeof value !== "string") {
    return defaultValue;
  }

  const cleanedValue = value.trim();

  return cleanedValue || defaultValue;
}

/**
 * Retourne un identifiant React stable.
 */
function getProjectKey(
  project: Project,
  index: number
): string {
  const projectId = Number(project.id);

  if (
    Number.isInteger(projectId) &&
    projectId > 0
  ) {
    return `project-${projectId}`;
  }

  return `project-${index}`;
}

/**
 * Transforme les différents formats possibles de galerie
 * (tableau JSON, tableau JavaScript ou chaîne séparée).
 */
type ProjectWithGallery = Project & {
  images?: string[] | string | null;
  gallery?: string[] | string | null;
  project_images?: string[] | string | null;
};

function parseProjectImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter(
        (item): item is string =>
          typeof item === "string"
      )
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is string =>
          typeof item === "string" &&
          item.trim().length > 0
      );
    }
  } catch {
    /*
     * Accepte également une chaîne :
     * photo1.jpg,photo2.jpg
     */
  }

  return value
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Carte interactive d’un projet.
 * Le composant client ouvre une galerie plein écran.
 */
function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const title = getSafeText(
    project.title,
    "Réalisation Farre Service"
  );

  const category = getSafeText(
    project.category,
    "Projet"
  );

  const location = getSafeText(
    project.location
  );

  const description = getSafeText(
    project.description
  );

  const wide = toBoolean(
    project.isWide
  );

  const tall = toBoolean(
    project.isTall
  );

  const imageUrl = getProjectImageUrl(
    project.image
  );

  const projectWithGallery =
    project as ProjectWithGallery;

  const galleryImages = Array.from(
    new Set(
      [
        project.image,
        ...parseProjectImages(
          projectWithGallery.images
        ),
        ...parseProjectImages(
          projectWithGallery.gallery
        ),
        ...parseProjectImages(
          projectWithGallery.project_images
        ),
      ]
        .filter(
          (item): item is string =>
            typeof item === "string"
        )
        .map((item) => item.trim())
        .filter(Boolean)
        .map(getProjectImageUrl)
    )
  );

  if (galleryImages.length === 0) {
    galleryImages.push(imageUrl);
  }

  const itemClasses = [
    "portfolio-premium-item",
    wide
      ? "portfolio-premium-item-wide"
      : "",
    tall
      ? "portfolio-premium-item-tall"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imageAlt = location
    ? `${title} — ${location}`
    : `${title} — Farre Service`;

  return (
    <Reveal
      delay={(index % 3) * 0.06}
      className={itemClasses}
    >
      <ProjectGallery
        index={index}
        imageUrl={imageUrl}
        galleryImages={galleryImages}
        imageAlt={imageAlt}
        itemClasses="portfolio-gallery-inner"
        title={title}
        category={category}
        location={location}
        description={description}
        wide={wide}
        tall={tall}
      />
    </Reveal>
  );
}

export default async function PortfolioPage() {
  /*
   * Chargement :
   *
   * Next.js
   *    ↓
   * Express /api/projects
   *    ↓
   * MySQL projects
   */
  const receivedProjects =
    await getProjects();

  /*
   * Protection supplémentaire :
   * getProjects retourne normalement toujours
   * un tableau, mais on vérifie quand même.
   */
  const projects: Project[] =
    Array.isArray(receivedProjects)
      ? receivedProjects
      : [];

  /*
   * Calcul des catégories sans doublons.
   * La casse est ignorée :
   *
   * "Inspection" et "inspection"
   * sont considérées comme la même catégorie.
   */
  const categories = new Set(
    projects
      .map((project) =>
        getSafeText(project.category)
          .toLocaleLowerCase("fr")
      )
      .filter(Boolean)
  );

  const numberOfCategories =
    categories.size;

  const statistics = [
    {
      icon: Camera,
      value: String(projects.length),
      title: "Réalisations présentées",
      text:
        "Une sélection d’interventions menées dans différents environnements.",
    },
    {
      icon: Waves,
      value: String(numberOfCategories),
      title: "Domaines techniques",
      text:
        "Inspection, maintenance, soudure, hydraulique, offshore et portuaire.",
    },
    {
      icon: ShieldCheck,
      value: "Terrain",
      title: "Expertise opérationnelle",
      text:
        "Des interventions préparées selon les contraintes de chaque site.",
    },
  ];

  return (
    <>
      {/* En-tête de la page */}

      <PageHero
        title="Notre portfolio"
        description="Découvrez en images quelques travaux et interventions réalisés par les équipes de Farre Service."
        image="/images/16.jpg"
        currentPage="Portfolio"
      />

      {/* Introduction */}

      <section className="portfolio-premium-intro">
        <div
          className="portfolio-premium-pattern"
          aria-hidden="true"
        />

        <div className="container portfolio-premium-intro-grid">
          <Reveal className="portfolio-premium-intro-content">
            <span className="portfolio-premium-label">
              <Camera
                size={15}
                aria-hidden="true"
              />

              Réalisations terrain
            </span>

            <h2>
              Une expertise visible à travers
              des projets concrets
            </h2>

            <p>
              Découvrez une sélection
              d’interventions menées par Farre
              Service dans les domaines
              maritimes, portuaires,
              hydrauliques, industriels et
              sous-marins.
            </p>

            <div className="portfolio-premium-checks">
              <div>
                <CheckCircle2
                  aria-hidden="true"
                />

                <span>
                  Interventions sur des sites
                  complexes
                </span>
              </div>

              <div>
                <CheckCircle2
                  aria-hidden="true"
                />

                <span>
                  Équipes techniques
                  spécialisées
                </span>
              </div>

              <div>
                <CheckCircle2
                  aria-hidden="true"
                />

                <span>
                  Moyens adaptés à chaque
                  environnement
                </span>
              </div>
            </div>

            <Link
              href="/contact"
              className="button button-primary button-lg"
            >
              Étudier votre projet

              <ArrowRight
                size={18}
                aria-hidden="true"
              />
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
              <HardHat aria-hidden="true" />

              <div>
                <strong>
                  Expertise opérationnelle
                </strong>

                <span>
                  Sur terre, en port et sous
                  l’eau
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Statistiques dynamiques */}

      <section className="portfolio-premium-stats">
        <div className="container portfolio-premium-stats-grid">
          {statistics.map(
            (item, index) => {
              const Icon = item.icon;

              return (
                <Reveal
                  key={item.title}
                  delay={index * 0.08}
                >
                  <article className="portfolio-premium-stat-card">
                    <div className="portfolio-premium-stat-icon">
                      <Icon aria-hidden="true" />
                    </div>

                    <div>
                      <strong>
                        {item.value}
                      </strong>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.text}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            }
          )}
        </div>
      </section>

      {/* Galerie dynamique */}

      <section className="portfolio-gallery-section">
        <div
          className="portfolio-gallery-glow portfolio-gallery-glow-one"
          aria-hidden="true"
        />

        <div
          className="portfolio-gallery-glow portfolio-gallery-glow-two"
          aria-hidden="true"
        />

        <div className="container">
          <Reveal className="portfolio-gallery-heading">
            <div>
              <span className="eyebrow eyebrow-light">
                Notre galerie
              </span>

              <h2>
                Des réalisations dans des
                environnements exigeants
              </h2>
            </div>

            <p>
              Inspection, maintenance, soudure,
              nettoyage, installation de
              conduites, travaux portuaires et
              opérations offshore.
            </p>
          </Reveal>

          {projects.length === 0 ? (
            <div
              className="portfolio-empty-state"
              role="status"
            >
              <Camera
                size={45}
                aria-hidden="true"
              />

              <h3>
                Aucune réalisation disponible
              </h3>

              <p>
                Aucun projet actif n’est
                actuellement disponible.
              </p>
            </div>
          ) : (
            <div className="portfolio-premium-grid">
              {projects.map(
                (project, index) => (
                  <ProjectCard
                    key={getProjectKey(
                      project,
                      index
                    )}
                    project={project}
                    index={index}
                  />
                )
              )}
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

        <div
          className="portfolio-final-cta-overlay"
          aria-hidden="true"
        />

        <div
          className="portfolio-final-cta-grid"
          aria-hidden="true"
        />

        <div className="container portfolio-final-cta-content">
          <Reveal>
            <span className="portfolio-final-cta-kicker">
              Votre prochaine intervention
            </span>

            <h2>
              Besoin d’une équipe pour un
              projet spécialisé ?
            </h2>

            <p>
              Décrivez-nous votre besoin ainsi
              que les caractéristiques de votre
              site. Notre équipe vous proposera
              une solution adaptée.
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

              <ArrowRight
                size={19}
                aria-hidden="true"
              />
            </Link>

            <div className="portfolio-final-cta-phones">
              <a
                href="tel:+213660952397"
                className="portfolio-final-cta-phone"
                aria-label="Appeler Farre Service au 0660 95 23 97"
              >
                <span>
                  Contact direct 1
                </span>

                <strong>
                  0660 95 23 97
                </strong>
              </a>

              <a
                href="tel:+213697117917"
                className="portfolio-final-cta-phone"
                aria-label="Appeler Farre Service au 0697 11 79 17"
              >
                <span>
                  Contact direct 2
                </span>

                <strong>
                  0697 11 79 17
                </strong>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}