import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Références", href: "/references" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "Inspection sous-marine",
  "Maintenance maritime",
  "Travaux hydrauliques",
  "Soudure sous-marine",
  "Entretien portuaire",
  "Assistance technique",
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-decoration" />

      <div className="container footer-grid">
        <div className="footer-company">
          <Link href="/" className="footer-brand">
            <Image
              src="/images/logo.png"
              alt="Logo Farre Service"
              width={83}
              height={68}
            />

            <span>
              <strong>FARRE SERVICE</strong>
              <small>Travaux sous-marins</small>
            </span>
          </Link>

          <p>
            Entreprise algérienne spécialisée dans les travaux maritimes,
            portuaires, hydrauliques et sous-marins.
          </p>

          <Link href="/contact" className="footer-action">
            Nous contacter
            <Send size={17} />
          </Link>
        </div>

        <div className="footer-column">
          <h3>Navigation</h3>

          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h3>Nos métiers</h3>

          <ul>
            {services.map((service) => (
              <li key={service}>
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column footer-contact">
          <h3>Coordonnées</h3>

          <a href="tel:+213660952397">
            <Phone />
            <span>
              <small>Téléphone</small>
              0660 952 397
            </span>
          </a>

          <a href="mailto:benkadouryacine05@gmail.com">
            <Mail />
            <span>
              <small>Adresse e-mail</small>
              benkadouryacine05@gmail.com
            </span>
          </a>

          <div>
            <MapPin />
            <span>
              <small>Adresse</small>
              Lot N°32 Hai Belgaid, Bir El Djir, Oran
            </span>
          </div>

          <div>
            <Clock3 />
            <span>
              <small>Horaires</small>
              Dimanche – Jeudi : 08h00 – 17h00
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>
            © {new Date().getFullYear()} EURL Farre Service. Tous droits
            réservés.
          </p>

          <span>Expertise maritime et sous-marine en Algérie</span>
        </div>
      </div>
    </footer>
  );
}