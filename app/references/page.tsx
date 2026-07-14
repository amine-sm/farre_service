import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Building2,
  CheckCircle2,
  Factory,
  MapPin,
  ShieldCheck,
  Ship,
  Waves,
} from "lucide-react";

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Nos références",
  description:
    "Découvrez les principales interventions maritimes, portuaires, hydrauliques et sous-marines réalisées par EURL Farre Service.",
};

const references = [
  {
    number: "01",
    work: "Mise en place des échelles et des défenses",
    location: "Nouveau port GNL3Z M7",
    client: "Compagnie FPS",
    category: "Travaux portuaires",
  },
  {
    number: "02",
    work: "Mise en place des crocs et panneaux",
    location: "Nouveau port GNL3Z M7",
    client: "SAIPEM",
    category: "Installation",
  },
  {
    number: "03",
    work: "Nettoyage du port avec utilisation d’une suceuse",
    location: "Port d’Arzew",
    client: "MCA",
    category: "Nettoyage",
  },
  {
    number: "04",
    work: "Repêchage de matériel en pleine mer",
    location: "Port d’Arzew",
    client: "EPA Arzew",
    category: "Assistance maritime",
  },
  {
    number: "05",
    work: "Colmatage des cavités portuaires",
    location: "Port d’Oran",
    client: "DTP Oran",
    category: "Réparation",
  },
  {
    number: "06",
    work: "Travaux sous-marins au niveau du P2",
    location: "Port d’Arzew",
    client: "MGT Maria Oran",
    category: "Travaux sous-marins",
  },
  {
    number: "07",
    work: "Inspection et nettoyage des bouées",
    location: "Port de Bethioua",
    client: "SAIPEM GNL3Z",
    category: "Inspection",
  },
  {
    number: "08",
    work: "Démolition des fenêtres de prise d’eau de mer",
    location: "Port de Bethioua",
    client: "SAIPEM GNL3Z",
    category: "Découpage",
  },
  {
    number: "09",
    work: "Réparation du caisson au niveau de la brise-lame",
    location: "Port de Bethioua",
    client: "SAIPEM GNL3Z",
    category: "Maintenance",
  },
  {
    number: "10",
    work: "Réglage de gravier sous-marin",
    location: "El Mactaa",
    client: "Société ARAS",
    category: "Travaux hydrauliques",
  },
  {
    number: "11",
    work: "Suivi de la mise en place de tubes en béton",
    location: "El Mactaa",
    client: "Société ARAS",
    category: "Installation",
  },
  {
    number: "12",
    work: "Inspection de coques de navires",
    location: "Port d’Arzew",
    client: "Entreprises privées",
    category: "Inspection navale",
  },
  {
    number: "13",
    work: "Inspection et nettoyage des tuyaux d’eau de mer",
    location: "Kahrama Targa",
    client: "Clients nationaux et étrangers",
    category: "Inspection",
  },
  {
    number: "14",
    work: "Assemblage de conduites avec blocs en béton",
    location: "Port d’Arzew",
    client: "Daewoo E&C",
    category: "Conduites",
  },
  {
    number: "15",
    work: "Repêchage d’épaves",
    location: "Port d’Arzew",
    client: "EPA Arzew",
    category: "Renflouage",
  },
  {
    number: "16",
    work: "Réparation des conduites d’amenée d’eau de mer",
    location: "Bethioua, Mostaganem et Mactaa",
    client: "MMC, MTM et AOM",
    category: "Hydraulique",
  },
  {
    number: "17",
    work: "Maintenance des conduites offshore en PEHD",
    location: "Port d’Arzew",
    client: "GCB",
    category: "Offshore",
  },
];

const highlights = [
  {
    icon: Waves,
    value: "17+",
    label: "Interventions majeures",
    text: "Des opérations menées sur des sites industriels et portuaires stratégiques.",
  },
  {
    icon: MapPin,
    value: "6",
    label: "Zones d’intervention",
    text: "Arzew, Oran, Bethioua, Mostaganem, Mactaa et Targa.",
  },
  {
    icon: Building2,
    value: "12+",
    label: "Clients et partenaires",
    text: "Des acteurs nationaux et internationaux de premier plan.",
  },
];

const featuredProjects = [
  {
    image: "/images/12.jpg",
    category: "Travaux portuaires",
    title: "Maintenance et équipement du nouveau port GNL3Z",
    location: "Bethioua",
  },
  {
    image: "/images/15.jpg",
    category: "Hydraulique",
    title: "Réparation de conduites d’amenée d’eau de mer",
    location: "Bethioua, Mostaganem et Mactaa",
  },
  {
    image: "/images/6.jpg",
    category: "Inspection",
    title: "Inspection de coques, bouées et réseaux immergés",
    location: "Port d’Arzew",
  },
];

export default function ReferencesPage() {
  return (
    <>
      <PageHero
        title="Nos références"
        description="Des interventions réalisées auprès d’acteurs industriels, portuaires, hydrauliques et maritimes."
        image="/images/8.jpg"
        currentPage="Références"
      />

      <section className="references-premium-intro">
        <div className="references-premium-pattern" />

        <div className="container references-premium-intro-grid">
          <Reveal className="references-premium-intro-content">
            <span className="eyebrow">Expérience terrain</span>

            <h2>
              Une expertise confirmée sur des projets maritimes complexes
            </h2>

            <p>
              Farre Service accompagne les entreprises industrielles,
              portuaires et hydrauliques dans des missions d’inspection,
              d’entretien, de réparation, d’installation et d’assistance
              sous-marine.
            </p>

            <div className="references-premium-checks">
              <div>
                <CheckCircle2 />
                <span>Interventions préparées selon les contraintes du site</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Équipes spécialisées et moyens techniques adaptés</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Suivi opérationnel et compte rendu de mission</span>
              </div>
            </div>

            <Link href="/contact" className="button button-primary button-lg">
              Présenter votre projet
              <ArrowRight size={18} />
            </Link>
          </Reveal>

          <Reveal className="references-premium-visual" direction="right">
            <div className="references-premium-main-image">
              <Image
                src="/images/9.jpg"
                alt="Intervention sous-marine Farre Service"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>

            <div className="references-premium-badge">
              <ShieldCheck />
              <div>
                <strong>Expérience éprouvée</strong>
                <span>Sur des sites maritimes exigeants</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="references-premium-stats">
        <div className="container references-premium-stats-grid">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.label} delay={index * 0.08}>
                <article className="references-premium-stat-card">
                  <div className="references-premium-stat-icon">
                    <Icon />
                  </div>

                  <div>
                    <strong>{item.value}</strong>
                    <h3>{item.label}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="references-featured-section">
        <div className="container">
          <Reveal className="references-featured-heading">
            <div>
              <span className="eyebrow eyebrow-light">
                Projets représentatifs
              </span>

              <h2>
                Des réalisations concrètes dans plusieurs domaines techniques
              </h2>
            </div>

            <p>
              Une sélection de missions illustrant notre capacité à intervenir
              sur des infrastructures portuaires, navales et hydrauliques.
            </p>
          </Reveal>

          <div className="references-featured-grid">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.08}>
                <article className="references-featured-card">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />

                  <div className="references-featured-overlay" />

                  <div className="references-featured-content">
                    <span>{project.category}</span>
                    <h3>{project.title}</h3>

                    <p>
                      <MapPin />
                      {project.location}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="references-list-section">
        <div className="references-list-glow references-list-glow-one" />
        <div className="references-list-glow references-list-glow-two" />

        <div className="container">
          <Reveal className="references-list-heading">
            <div>
              <span className="eyebrow">Références détaillées</span>

              <h2 className="section-title">
                Une expérience construite opération après opération
              </h2>

              <p>
                Retrouvez une sélection des principales interventions réalisées
                par nos équipes.
              </p>
            </div>

            <div className="references-list-count">
              <Anchor />
              <strong>17</strong>
              <span>Références présentées</span>
            </div>
          </Reveal>

          <div className="references-premium-grid">
            {references.map((reference, index) => (
              <Reveal
                key={`${reference.number}-${reference.work}`}
                delay={(index % 3) * 0.06}
              >
                <article className="references-premium-card">
                  <div className="references-premium-card-top">
                    <span className="references-premium-number">
                      {reference.number}
                    </span>

                    <span className="references-premium-category">
                      {reference.category}
                    </span>
                  </div>

                  <h3>{reference.work}</h3>

                  <div className="references-premium-meta">
                    <div>
                      <MapPin />
                      <span>{reference.location}</span>
                    </div>

                    <div>
                      <Building2 />
                      <span>{reference.client}</span>
                    </div>
                  </div>

                  <div className="references-premium-card-footer">
                    <span>Mission réalisée</span>
                    <CheckCircle2 />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="references-clients-banner">
        <div className="container references-clients-content">
          <Reveal>
            <span className="eyebrow eyebrow-light">Ils nous font confiance</span>

            <h2>
              Une collaboration avec des acteurs industriels de premier plan
            </h2>
          </Reveal>

          <Reveal className="references-clients-list" direction="right">
            {[
              "SAIPEM",
              "EPA Arzew",
              "Daewoo E&C",
              "GCB",
              "MCA",
              "DTP Oran",
            ].map((client) => (
              <div key={client}>
                <Factory />
                <span>{client}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="references-final-cta">
        <Image
          src="/images/page3.png"
          alt="Travaux maritimes Farre Service"
          fill
          className="references-final-cta-image"
          sizes="100vw"
        />

        <div className="references-final-cta-overlay" />
        <div className="references-final-cta-grid" />

        <div className="container references-final-cta-content">
          <Reveal>
            <span>Votre projet maritime ou sous-marin</span>

            <h2>
              Vous avez une intervention similaire à réaliser ?
            </h2>

            <p>
              Présentez-nous vos contraintes. Notre équipe étudiera votre besoin
              afin de proposer une solution technique adaptée.
            </p>
          </Reveal>

          <Reveal direction="right">
            <Link href="/contact" className="button button-primary button-lg">
              Demander une étude
              <ArrowRight size={19} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
