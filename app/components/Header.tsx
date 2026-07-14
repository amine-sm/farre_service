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
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
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
        <div className="header-top">
          <div className="container header-top-content">
            <span>Travaux maritimes, portuaires et sous-marins</span>

            <a href="tel:+213660952397" aria-label="Appeler Farre Service">
              <Phone size={14} aria-hidden="true" />
              <span>0660 952 397</span>
            </a>
          </div>
        </div>

        <div className="container header-main">
          <Link href="/" className="brand" aria-label="Accueil Farre Service">
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

          <nav className="desktop-nav" aria-label="Navigation principale">
            {navigation.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className={isActive(item.href) ? "nav-link active" : "nav-link"}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/contact" className="header-cta">
            Demander un devis
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={menuOpen ? "mobile-menu open" : "mobile-menu"}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Navigation mobile">
          {navigation.map((item, index) => (
            <Link
              href={item.href}
              key={item.href}
              className={
                isActive(item.href)
                  ? "mobile-menu-link active"
                  : "mobile-menu-link"
              }
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}

          <Link href="/contact" className="button button-primary mobile-menu-cta">
            Demander un devis
          </Link>
        </nav>
      </div>
    </>
  );
}