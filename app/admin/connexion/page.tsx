"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  Waves,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email
              .trim()
              .toLowerCase(),
            password,
          }),
        }
      );

      const result: LoginResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Adresse email ou mot de passe incorrect."
        );
      }

      router.replace(
        "/admin/admin-acces"
      );

      router.refresh();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Connexion impossible."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-decoration admin-login-decoration-one" />
      <div className="admin-login-decoration admin-login-decoration-two" />

      <section className="admin-login-layout">
        <div className="admin-login-presentation">
          <Link
            href="/"
            className="admin-login-back"
          >
            <ArrowLeft size={17} />
            Retour au site
          </Link>

          <div className="admin-login-brand">
            <span>
              <Image
                src="/images/logo.png"
                alt="Logo Farre Service"
                width={74}
                height={74}
                priority
              />
            </span>

            <div>
              <strong>
                FARRE SERVICE
              </strong>

              <small>
                Administration sécurisée
              </small>
            </div>
          </div>

          <div className="admin-login-presentation-content">
            <span className="admin-login-presentation-kicker">
              <Waves size={16} />
              Gestion du portfolio
            </span>

            <h1>
              Pilotez les réalisations de
              votre entreprise.
            </h1>

            <p>
              Publiez, organisez et gérez les
              travaux affichés sur le site Farre
              Service depuis un espace
              d’administration sécurisé.
            </p>

            <div className="admin-login-security">
              <ShieldCheck size={23} />

              <div>
                <strong>
                  Connexion protégée
                </strong>

                <span>
                  Votre session est enregistrée
                  dans un cookie sécurisé.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-login-form-side">
          <section className="admin-login-card">
            <div className="admin-login-icon">
              <LockKeyhole size={29} />
            </div>

            <span className="admin-login-kicker">
              Espace réservé
            </span>

            <h2>
              Connexion administrateur
            </h2>

            <p className="admin-login-description">
              Saisissez vos identifiants pour
              accéder au panneau de gestion.
            </p>

            {error && (
              <div className="admin-login-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <label className="admin-login-label">
                <span>
                  Adresse email
                </span>

                <div className="admin-login-field">
                  <Mail size={18} />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="admin@farreservice.dz"
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </div>
              </label>

              <label className="admin-login-label">
                <span>
                  Mot de passe
                </span>

                <div className="admin-login-field">
                  <LockKeyhole
                    size={18}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="admin-login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="admin-spin"
                    />
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn size={19} />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            <p className="admin-login-help">
              Accès réservé aux responsables
              autorisés de Farre Service.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
