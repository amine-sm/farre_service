"use client";

import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { FormEvent, useState } from "react";

import Reveal from "../components/Reveal";
import PageHero from "../components/PageHero";


const details = [
  {
    icon: Phone,
    title: "Téléphone",
    value: "0660 952 397",
    href: "tel:+213660952397",
  },
  {
    icon: Mail,
    title: "Adresse e-mail",
    value: "benkadouryacine05@gmail.com",
    href: "mailto:benkadouryacine05@gmail.com",
  },
  {
    icon: MapPin,
    title: "Adresse",
    value: "Lot N°32 Hai Belgaid, Bir El Djir, Oran",
  },
  {
    icon: Clock3,
    title: "Horaires",
    value: "Dimanche – Jeudi : 08h00 – 17h00",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <>
      <PageHero
        title="Nous contacter"
        description="Présentez-nous votre besoin et obtenez une réponse adaptée à votre projet."
        image="/images/19.jpg"
        currentPage="Contact"
      />

      <section className="section contact-section">
        <div className="container contact-grid">
          <Reveal className="contact-information" direction="left">
            <span className="eyebrow">Parlons de votre projet</span>

            <h2 className="section-title">
              Notre équipe est à votre disposition
            </h2>

            <p className="section-description">
              Pour une demande de devis, une collaboration ou des informations
              complémentaires, contactez-nous par téléphone ou e-mail.
            </p>

            <div className="contact-details">
              {details.map((detail) => {
                const Icon = detail.icon;

                const content = (
                  <>
                    <span className="contact-icon">
                      <Icon />
                    </span>

                    <span>
                      <small>{detail.title}</small>
                      <strong>{detail.value}</strong>
                    </span>
                  </>
                );

                return detail.href ? (
                  <a href={detail.href} key={detail.title}>
                    {content}
                  </a>
                ) : (
                  <div key={detail.title}>{content}</div>
                );
              })}
            </div>

            <div className="emergency-card">
              <CheckCircle2 />

              <div>
                <strong>Intervention technique urgente</strong>
                <p>
                  Pour une demande urgente, contactez-nous directement par
                  téléphone.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="contact-form-card" direction="right">
            <span className="form-kicker">Demande de devis</span>
            <h2>Envoyez-nous un message</h2>
            <p>Remplissez les informations ci-dessous.</p>

            {sent && (
              <div className="form-success">
                <CheckCircle2 />
                Votre demande a été enregistrée dans l’interface.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  <span>Nom complet</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom"
                    required
                  />
                </label>

                <label>
                  <span>Entreprise</span>
                  <input
                    type="text"
                    name="company"
                    placeholder="Nom de l’entreprise"
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  <span>Adresse e-mail</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    required
                  />
                </label>

                <label>
                  <span>Téléphone</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Votre numéro"
                    required
                  />
                </label>
              </div>

              <label>
                <span>Service demandé</span>

                <select name="service" defaultValue="" required>
                  <option value="" disabled>
                    Sélectionnez un service
                  </option>
                  <option value="inspection">Inspection sous-marine</option>
                  <option value="maintenance">Maintenance et nettoyage</option>
                  <option value="soudure">Soudure et découpage</option>
                  <option value="hydraulique">Travaux hydrauliques</option>
                  <option value="portuaire">Travaux portuaires</option>
                  <option value="assistance">Assistance technique</option>
                </select>
              </label>

              <label>
                <span>Description du projet</span>

                <textarea
                  name="message"
                  rows={7}
                  placeholder="Décrivez le site, le lieu et le type d’intervention..."
                  required
                />
              </label>

              <button type="submit" className="button button-primary form-button">
                Envoyer la demande
                <Send size={18} />
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="map-section">
        <div className="container map-card">
          <MapPin />

          <div>
            <strong>EURL Farre Service</strong>
            <span>Lot N°32 Hai Belgaid, Bir El Djir, Oran 31000</span>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Hai+Belgaid+Bir+El+Djir+Oran"
            target="_blank"
            rel="noreferrer"
            className="button button-white"
          >
            Ouvrir Google Maps
          </a>
        </div>
      </section>
    </>
  );
}