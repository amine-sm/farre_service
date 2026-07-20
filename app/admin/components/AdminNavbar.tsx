"use client";

import Image from "next/image";
import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface AdminMenuItem {
  label: string;
  href: string;

  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;

  exact?: boolean;
}

const menuItems: AdminMenuItem[] = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Travaux",
    href: "/admin/admin-acces",
    icon: FolderKanban,
  },
  {
    label: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
  },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  function isActive(
    item: AdminMenuItem
  ) {
    if (item.exact) {
      return pathname === item.href;
    }

    return (
      pathname === item.href ||
      pathname.startsWith(
        `${item.href}/`
      )
    );
  }

  async function logout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",

          headers: {
            Accept: "application/json",
          },
        }
      );

      const result =
        await response.json().catch(
          () => null
        );

      if (
        !response.ok ||
        result?.success === false
      ) {
        throw new Error(
          result?.message ||
            "Impossible de se déconnecter."
        );
      }
    } catch (error) {
      console.error(
        "Erreur pendant la déconnexion :",
        error
      );
    } finally {
      setMenuOpen(false);

      router.replace(
        "/admin/connexion"
      );

      router.refresh();

      setLoggingOut(false);
    }
  }

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <Link
            href="/admin/admin-acces"
            className="admin-brand"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <span className="admin-brand-logo">
              <Image
                src="/images/logo.png"
                alt="Farre Service"
                width={52}
                height={52}
                priority
              />
            </span>

            <span className="admin-brand-copy">
              <strong>
                FARRE SERVICE
              </strong>

              <small>
                <ShieldCheck
                  size={13}
                />

                Administration
              </small>
            </span>
          </Link>

          <nav
            className={`admin-nav ${
              menuOpen
                ? "admin-nav-open"
                : ""
            }`}
            aria-label="Navigation administration"
          >
            {menuItems.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  isActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-item ${
                      active
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setMenuOpen(
                        false
                      )
                    }
                  >
                    <Icon
                      size={18}
                      strokeWidth={2.1}
                    />

                    <span>
                      {item.label}
                    </span>
                  </Link>
                );
              }
            )}

            <div className="admin-nav-mobile-actions">
              <Link
                href="/portfolio"
                target="_blank"
                className="admin-mobile-site"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                <ExternalLink
                  size={17}
                />

                Voir le site
              </Link>

              <button
                type="button"
                className="admin-mobile-logout"
                onClick={logout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <Loader2
                    size={17}
                    className="admin-spin"
                  />
                ) : (
                  <LogOut
                    size={17}
                  />
                )}

                {loggingOut
                  ? "Déconnexion..."
                  : "Déconnexion"}
              </button>
            </div>
          </nav>

          <div className="admin-topbar-actions">
            <Link
              href="/portfolio"
              target="_blank"
              className="admin-view-site"
            >
              <ExternalLink
                size={17}
              />

              <span>
                Voir le site
              </span>
            </Link>

            <button
              type="button"
              className="admin-account"
              aria-label="Compte administrateur"
            >
              <span className="admin-account-avatar">
                A
              </span>

              <span className="admin-account-copy">
                <strong>
                  Administrateur
                </strong>

                <small>
                  Farre Service
                </small>
              </span>
            </button>

            {/* Bouton desktop de déconnexion */}
            <button
              type="button"
              className="admin-desktop-logout"
              onClick={logout}
              disabled={loggingOut}
              aria-label="Se déconnecter"
            >
              {loggingOut ? (
                <Loader2
                  size={17}
                  className="admin-spin"
                />
              ) : (
                <LogOut size={17} />
              )}

              <span>
                {loggingOut
                  ? "Déconnexion..."
                  : "Déconnexion"}
              </span>
            </button>

            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() =>
                setMenuOpen(
                  (value) => !value
                )
              }
              aria-expanded={menuOpen}
              aria-label={
                menuOpen
                  ? "Fermer le menu"
                  : "Ouvrir le menu"
              }
            >
              {menuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="admin-nav-backdrop"
          onClick={() =>
            setMenuOpen(false)
          }
          aria-label="Fermer le menu"
        />
      )}
    </>
  );
}