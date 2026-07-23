"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Références", href: "/references" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const previousScrollRef = useRef(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  /*
   * Afficher ou masquer le header selon le scroll.
   */
  useEffect(() => {
    previousScrollRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const previousScroll = previousScrollRef.current;

      setScrolled(currentScroll > 30);

      if (currentScroll <= 180) {
        setHidden(false);
      } else if (currentScroll > previousScroll) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      previousScrollRef.current = currentScroll;
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * Fermer le menu mobile après un changement de page.
   */
  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
  }, [pathname]);

  /*
   * Bloquer le scroll lorsque le menu mobile est ouvert.
   */
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow =
        previousHtmlOverflow;
    };
  }, [menuOpen]);

  /*
   * Fermer le menu avec la touche Échap.
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /*
   * Vérifier si le lien correspond à la page active.
   */
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  /*
   * Action lors du clic sur le logo.
   */
  const handleLogoClick = () => {
    setMenuOpen(false);
    setHidden(false);

    if (pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={[
          "site-header",
          scrolled ? "site-header-scrolled" : "",
          hidden && !menuOpen ? "site-header-hidden" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Barre supérieure */}
        <div className="header-top">
          <div className="container header-top-content">
            <span className="header-top-description">
              Travaux maritimes, portuaires et sous-marins
            </span>

            <div className="header-phone-list">
              <a
                href="tel:+213660952397"
                className="header-phone"
                aria-label="Appeler Farre Service au 0660 95 23 97"
              >
                <Phone
                  className="header-phone-icon"
                  size={15}
                  aria-hidden="true"
                />

                <span className="header-phone-number">
                  0660 95 23 97
                </span>
              </a>

              <span
                className="header-phone-separator"
                aria-hidden="true"
              >
                |
              </span>

              <a
                href="tel:+213697117917"
                className="header-phone"
                aria-label="Appeler Farre Service au 0697 11 79 17"
              >
                <Phone
                  className="header-phone-icon"
                  size={15}
                  aria-hidden="true"
                />

                <span className="header-phone-number">
                  0697 11 79 17
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <div className="container header-main">
          {/* Logo */}
          <Link
            href="/"
            scroll
            className="brand"
            aria-label="Retour à l’accueil"
            onClick={handleLogoClick}
          >
            <span className="brand-logo">
              <Image
                src="/images/logorg.png"
                alt="Logo Farre Service"
                width={75}
                height={62}
                priority
              />
            </span>

            <span className="brand-text">
              <strong>FARRE SERVICE</strong>
              <small>Travaux sous-marins</small>
            </span>
          </Link>

          {/* Navigation ordinateur */}
          <nav
            className="desktop-nav"
            aria-label="Navigation principale"
          >
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={
                    active ? "nav-link active" : "nav-link"
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bouton devis */}
          <Link href="/contact" className="header-cta">
            Demander un devis
          </Link>

          {/* Bouton menu mobile */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => {
              setMenuOpen((currentValue) => !currentValue);
              setHidden(false);
            }}
            aria-label={
              menuOpen ? "Fermer le menu" : "Ouvrir le menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? (
              <X size={27} aria-hidden="true" />
            ) : (
              <Menu size={27} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        id="mobile-navigation"
        className={menuOpen ? "mobile-menu open" : "mobile-menu"}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Navigation mobile">
          {navigation.map((item, index) => {
            const active = isActive(item.href);

            return (
              <Link
                href={item.href}
                key={item.href}
                className={
                  active
                    ? "mobile-menu-link active"
                    : "mobile-menu-link"
                }
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                {item.label}
              </Link>
            );
          })}

          <div className="mobile-menu-phones">
            <a
              href="tel:+213660952397"
              className="mobile-menu-phone"
              tabIndex={menuOpen ? 0 : -1}
            >
              <Phone size={17} aria-hidden="true" />
              <span>0660 95 23 97</span>
            </a>

            <a
              href="tel:+213697117917"
              className="mobile-menu-phone"
              tabIndex={menuOpen ? 0 : -1}
            >
              <Phone size={17} aria-hidden="true" />
              <span>0697 11 79 17</span>
            </a>
          </div>

          <Link
            href="/contact"
            className="button button-primary mobile-menu-cta"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            Demander un devis
          </Link>
        </nav>
      </div>
    </>
  );
}