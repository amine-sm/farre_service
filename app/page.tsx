import Image from "next/image";
import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Camera,
  CheckCircle2,
  Construction,
  Droplets,
  HardHat,
  ShieldCheck,
  Ship,
  Sparkles,
  Waves,
  Wrench,
} from "lucide-react";
import Reveal from "./components/Reveal";

const services = [
  {
    icon: Camera,
    number: "01",
    title: "Inspection sous-marine",
    description:
      "Contrôle visuel et technique des ouvrages immergés, navires, conduites, bassins et installations industrielles.",
    image: "/images/6.jpg",
  },
  {
    icon: Wrench,
    number: "02",
    title: "Maintenance maritime",
    description:
      "Nettoyage, dévasement, entretien et réparation des installations et équipements sous-marins.",
    image: "/images/18.jpg",
  },
  {
    icon: HardHat,
    number: "03",
    title: "Soudure sous-marine",
    description:
      "Travaux de soudure, découpage, chemisage de pieux et pose d’anodes pour la protection des structures.",
    image: "/images/9.jpg",
  },
  {
    icon: Droplets,
    number: "04",
    title: "Travaux hydrauliques",
    description:
      "Pose, entretien et réparation des prises d’eau, canaux, conduites PEHD et ouvrages hydrauliques.",
    image: "/images/15.jpg",
  },
  {
    icon: Anchor,
    number: "05",
    title: "Travaux portuaires",
    description:
      "Balisage, installation de défenses, entretien des quais et protection des ouvrages portuaires et maritimes.",
    image: "/images/12.jpg",
  },
  {
    icon: Construction,
    number: "06",
    title: "Assistance technique",
    description:
      "Renflouage, recherche d’objets, récupération de matériels et mise à disposition de personnel spécialisé.",
    image: "/images/3.jpg",
  },
];

const projects = [
  {
    image: "/images/3.jpg",
    title: "Installation de conduites maritimes",
    category: "Travaux hydrauliques",
  },
  {
    image: "/images/6.jpg",
    title: "Inspection d’ouvrages immergés",
    category: "Inspection",
  },
  {
    image: "/images/9.jpg",
    title: "Soudure et découpage",
    category: "Maintenance industrielle",
  },
  {
    image: "/images/12.jpg",
    title: "Maintenance portuaire",
    category: "Travaux portuaires",
  },
  {
    image: "/images/15.jpg",
    title: "Maintenance de conduites PEHD",
    category: "Offshore",
  },
  {
    image: "/images/18.jpg",
    title: "Nettoyage d’installations",
    category: "Maintenance",
  },
];

const statistics = [
  { value: "80 m", label: "Profondeur d’intervention" },
  { value: "+15", label: "Références majeures" },
  { value: "24/7", label: "Capacité opérationnelle" },
  { value: "100%", label: "Engagement qualité" },
];

const commitments = [
  "Scaphandriers et techniciens spécialisés",
  "Préparation rigoureuse de chaque intervention",
  "Inspection photo et vidéo selon les missions",
  "Solutions adaptées aux contraintes du site",
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <Image
          src="/images/page2.png"
          alt="Travaux sous-marins Farre Service"
          fill
          priority
          className="home-hero-image"
          sizes="100vw"
        />

        <div className="home-hero-overlay" />
        <div className="home-hero-grid" />
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="container home-hero-layout">
          <Reveal className="home-hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              Expertise maritime et sous-marine
            </div>

            <h1>
              Une maîtrise technique
              <span> au cœur des profondeurs.</span>
            </h1>

            <p>
              EURL Farre Service accompagne les acteurs industriels,
              portuaires et hydrauliques dans leurs opérations sous-marines les
              plus exigeantes.
            </p>

            <div className="hero-actions">
              <Link href="/services" className="button button-primary button-lg">
                Explorer nos services
                <ArrowRight size={18} />
              </Link>

              <Link href="/contact" className="button button-outline button-lg">
                Demander un devis
              </Link>
            </div>

            <div className="hero-trust">
              <span>
                <ShieldCheck />
                Sécurité
              </span>

              <span>
                <HardHat />
                Expertise
              </span>

              <span>
                <Ship />
                Réactivité
              </span>
            </div>
          </Reveal>

          <Reveal className="hero-information-card" direction="right" delay={0.2}>
            <div className="hero-information-icon">
              <Waves />
            </div>

            <span>Capacité d’intervention</span>
            <strong>Milieux maritimes complexes</strong>

            <p>
              Ports, barrages, galeries noyées, bassins, installations
              industrielles et réseaux hydrauliques.
            </p>

            <Link href="/references">
              Découvrir nos références
              <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>

        <div className="scroll-indicator">
          <span>Découvrir</span>
          <div>
            <i />
          </div>
        </div>
      </section>

      <section className="statistics-section">
        <div className="container statistics-grid">
          {statistics.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.08}>
              <article className="statistic-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section about-section">
        <div className="container about-grid">
          <Reveal className="about-visual" direction="left">
            <div className="about-main-image">
              <Image
                src="/images/2.jpg"
                alt="Scaphandrier Farre Service"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>

            <div className="about-small-image">
              <Image
                src="/images/7.jpg"
                alt="Intervention sous-marine"
                fill
                sizes="320px"
              />
            </div>

            <div className="about-badge">
              <strong>Expertise</strong>
              <span>Maritime & sous-marine</span>
            </div>
          </Reveal>

          <Reveal className="about-content" direction="right">
            <span className="eyebrow">À propos de Farre Service</span>

            <h2 className="section-title">
              Une expertise professionnelle pour les environnements immergés
            </h2>

            <p className="lead">
              Notre entreprise intervient dans les mers, ports, bassins,
              barrages, conduites et galeries noyées.
            </p>

            <p>
              Nous réalisons des opérations d’inspection, de maintenance, de
              nettoyage, de réparation et de construction avec une préparation
              adaptée à chaque mission.
            </p>

            <div className="check-list">
              {commitments.map((item) => (
                <div key={item}>
                  <CheckCircle2 />
                  <span>{item}</span>
                </div>
              ))}
            </div>

<div className="about-actions">
  <Link href="/services" className="button button-dark">
    Découvrir l’entreprise
    <ArrowRight size={18} />
  </Link>

  <div className="phone-numbers">
    <a href="tel:+213660952397" className="phone-link">
      <span>Contact 1</span>
      <strong>0660 95 23 97</strong>
    </a>

    <a href="tel:+213697117917" className="phone-link">
      <span>Contact 2</span>
      <strong>0697 11 79 17</strong>
    </a>
  </div>
</div>
          </Reveal>
        </div>
      </section>

      <section className="services-premium-section">
        <div className="services-premium-pattern" />
        <div className="services-premium-glow services-premium-glow-one" />
        <div className="services-premium-glow services-premium-glow-two" />

        <div className="container services-premium-container">
          <Reveal className="services-premium-top">
            <div className="services-premium-heading">
              <span className="services-premium-kicker">Nos services</span>

              <h2>
                L’expertise sous-marine
                <span> au service de vos opérations</span>
              </h2>

              <p>
                Farre Service intervient avec des moyens techniques de pointe et
                des équipes hautement qualifiées pour garantir sécurité,
                performance et durabilité de vos infrastructures maritimes,
                portuaires et hydrauliques.
              </p>
            </div>

            <div className="services-premium-summary">
              <div className="services-premium-summary-grid">
                <div>
                  <ShieldCheck />
                  <span>Sécurité maximale</span>
                </div>

                <div>
                  <Waves />
                  <span>Équipements de pointe</span>
                </div>

                <div>
                  <CheckCircle2 />
                  <span>Équipes qualifiées</span>
                </div>
              </div>

              <Link href="/services" className="button button-primary button-lg">
                Tous nos services
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>

          <div className="services-premium-grid">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal key={service.title} delay={(index % 3) * 0.08}>
                  <article className="services-premium-card">
                    <div className="services-premium-image">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 900px) 100vw, 33vw"
                      />
                    </div>

                    <div className="services-premium-overlay" />

                    <div className="services-premium-content">
                      <div className="services-premium-card-top">
                        <div className="services-premium-icon">
                          <Icon />
                        </div>

                        <span>{service.number}</span>
                      </div>

                      <h3>{service.title}</h3>
                      <p>{service.description}</p>

                      <Link href="/services" className="services-premium-link">
                        Découvrir
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="services-premium-bottom">
            <div className="services-premium-bottom-left">
              <div className="services-premium-bottom-icon">
                <ShieldCheck />
              </div>

              <div>
                <span>Un projet, une intervention, un besoin spécifique ?</span>
                <h3>Notre équipe est à votre écoute pour vous accompagner.</h3>
              </div>
            </div>

            <Link href="/contact" className="button button-primary button-lg">
              Demander une étude
              <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="expertise-banner">
        <Image
          src="/images/page3.png"
          alt="Intervention sous-marine"
          fill
          className="expertise-image"
          sizes="100vw"
        />

        <div className="expertise-overlay" />

        <div className="container expertise-layout">
          <Reveal>
            <span className="eyebrow eyebrow-light">Notre engagement</span>

            <h2>
              Sécurité, précision et performance au cœur de chaque mission
            </h2>

            <p>
              Nos équipes appliquent des procédures rigoureuses afin de
              garantir une intervention maîtrisée, documentée et adaptée au
              site.
            </p>

            <Link href="/references" className="button button-white">
              Consulter nos références
              <ArrowRight size={18} />
            </Link>
          </Reveal>

          <Reveal className="expertise-process" direction="right">
            {[
              "Étude et préparation technique",
              "Mobilisation des moyens adaptés",
              "Intervention sécurisée sur site",
              "Compte rendu et recommandations",
            ].map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section projects-section">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">Nos réalisations</span>
              <h2 className="section-title">
                Une expertise concrète, visible sur le terrain
              </h2>
            </div>

            <Link href="/portfolio" className="text-link">
              Découvrir le portfolio
              <ArrowRight size={18} />
            </Link>
          </Reveal>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <Reveal
                key={project.title}
                delay={(index % 3) * 0.08}
                className={
                  index === 0 || index === 5 ? "project-wide" : undefined
                }
              >
                <article className="project-card">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 700px) 100vw, 40vw"
                  />

                  <div className="project-overlay" />

                  <div className="project-content">
                    <span>{project.category}</span>
                    <h3>{project.title}</h3>

                    <Link href="/portfolio" aria-label={project.title}>
                      <ArrowRight />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-content">
          <Reveal>
            <span className="eyebrow eyebrow-light">Votre prochain projet</span>

            <h2>
              Vous préparez une intervention maritime ou sous-marine ?
            </h2>

            <p>
              Présentez-nous votre besoin. Notre équipe étudiera le site et
              proposera une solution adaptée.
            </p>
          </Reveal>

          <Link href="/contact" className="button button-white button-lg">
            Demander un devis
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </>
  );
}