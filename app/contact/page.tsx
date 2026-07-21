"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

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
    value:
      "benkadouryacine05@gmail.com",
    href:
      "mailto:benkadouryacine05@gmail.com",
  },
  {
    icon: MapPin,
    title: "Adresse",
    value:
      "Lot N°32 Hai Belgaid, Bir El Djir, Oran",
  },
  {
    icon: Clock3,
    title: "Horaires",
    value:
      "Dimanche – Jeudi : 08h00 – 17h00",
  },
];

interface ContactResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
  };
}

export default function ContactPage() {
  const [sent, setSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [phone, setPhone] =
    useState("");

  useEffect(() => {
    if (!sent) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setSent(false);
      }, 10000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [sent]);

  function handlePhoneChange(
    value: string
  ) {
    const digitsOnly =
      value
        .replace(/\D/g, "")
        .slice(0, 10);

    setPhone(digitsOnly);

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setSent(false);
    setError("");

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const name =
      String(
        formData.get("name") ||
          ""
      ).trim();

    const company =
      String(
        formData.get("company") ||
          ""
      ).trim();

    const email =
      String(
        formData.get("email") ||
          ""
      )
        .trim()
        .toLowerCase();

    const service =
      String(
        formData.get("service") ||
          ""
      ).trim();

    const message =
      String(
        formData.get("message") ||
          ""
      ).trim();

    if (
      !name ||
      !email ||
      !phone ||
      !service ||
      !message
    ) {
      setError(
        "Veuillez remplir tous les champs obligatoires."
      );

      setLoading(false);

      return;
    }

    if (
      phone.length !== 8 &&
      phone.length !== 10
    ) {
      setError(
        ""
      );

      setLoading(false);

      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/api/contact-requests`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              name,
              company,
              email,
              phone,
              service,
              message,
            }),
          }
        );

      const result:
        ContactResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Impossible d’envoyer la demande."
        );
      }

      form.reset();
      setPhone("");
      setSent(true);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Impossible d’envoyer la demande."
      );
    } finally {
      setLoading(false);
    }
  }

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
          <Reveal
            className="contact-information"
            direction="left"
          >
            <span className="eyebrow">
              Parlons de votre projet
            </span>

            <h2 className="section-title">
              Notre équipe est à votre
              disposition
            </h2>

            <p className="section-description">
              Pour une demande de devis,
              une collaboration ou des
              informations complémentaires,
              contactez-nous par téléphone
              ou e-mail.
            </p>

            <div className="contact-details">
              {details.map(
                (detail) => {
                  const Icon =
                    detail.icon;

                  const content = (
                    <>
                      <span className="contact-icon">
                        <Icon />
                      </span>

                      <span>
                        <small>
                          {detail.title}
                        </small>

                        <strong>
                          {detail.value}
                        </strong>
                      </span>
                    </>
                  );

                  return detail.href ? (
                    <a
                      href={detail.href}
                      key={detail.title}
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={detail.title}
                    >
                      {content}
                    </div>
                  );
                }
              )}
            </div>

            <div className="emergency-card">
              <CheckCircle2 />

              <div>
                <strong>
                  Intervention technique
                  urgente
                </strong>

                <p>
                  Pour une demande urgente,
                  contactez-nous directement
                  par téléphone.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal
            className="contact-form-card"
            direction="right"
          >
            <span className="form-kicker">
              Demande de devis
            </span>

            <h2>
              Envoyez-nous un message
            </h2>

            <p>
              Remplissez les informations
              ci-dessous.
            </p>

            {sent && (
              <div
                className="form-success"
                role="status"
              >
                <CheckCircle2 />

                <span>
                  Votre demande a été
                  envoyée avec succès.
                </span>
              </div>
            )}

            {error && (
              <div
                className="form-error"
                role="alert"
              >
                <AlertCircle />

                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <label>
                  <span>
                    Nom complet
                  </span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom"
                    required
                    disabled={loading}
                  />
                </label>

                <label>
                  <span>
                    Entreprise
                  </span>

                  <input
                    type="text"
                    name="company"
                    placeholder="Nom de l’entreprise"
                    disabled={loading}
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  <span>
                    Adresse e-mail
                  </span>

                  <input
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    required
                    disabled={loading}
                  />
                </label>

                <label>
                  <span>
                    Téléphone
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(event) =>
                      handlePhoneChange(
                        event.target.value
                      )
                    }
                    placeholder="Votre numéro"
                    inputMode="numeric"
                    pattern="([0-9]{8}|[0-9]{10})"
                    minLength={8}
                    maxLength={10}
                    required
                    disabled={loading}
                  />

                </label>
              </div>

              <label>
                <span>
                  Service demandé
                </span>

                <select
                  name="service"
                  defaultValue=""
                  required
                  disabled={loading}
                >
                  <option
                    value=""
                    disabled
                  >
                    Sélectionnez un service
                  </option>

                  <option value="inspection">
                    Inspection sous-marine
                  </option>

                  <option value="maintenance">
                    Maintenance et nettoyage
                  </option>

                  <option value="soudure">
                    Soudure et découpage
                  </option>

                  <option value="hydraulique">
                    Travaux hydrauliques
                  </option>

                  <option value="portuaire">
                    Travaux portuaires
                  </option>

                  <option value="assistance">
                    Assistance technique
                  </option>
                </select>
              </label>

              <label>
                <span>
                  Description du projet
                </span>

                <textarea
                  name="message"
                  rows={7}
                  placeholder="Décrivez le site, le lieu et le type d’intervention..."
                  required
                  disabled={loading}
                />
              </label>

              <button
                type="submit"
                className="button button-primary form-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    Envoi en cours

                    <Loader2
                      size={18}
                      className="contact-spin"
                    />
                  </>
                ) : (
                  <>
                    Envoyer la demande

                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="map-section">
        <div className="container map-card">
          <MapPin />

          <div>
            <strong>
              EURL Farre Service
            </strong>

            <span>
              Lot N°32 Hai Belgaid,
              Bir El Djir, Oran 31000
            </span>
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
