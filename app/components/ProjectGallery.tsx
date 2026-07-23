"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  MapPin,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

type Props = {
  index: number;
  imageUrl: string;
  galleryImages: string[];
  imageAlt: string;
  itemClasses: string;
  title: string;
  category: string;
  location: string;
  description: string;
  wide: boolean;
  tall: boolean;
};

function isExternalImage(imageUrl: string): boolean {
  return (
    imageUrl.includes("/uploads/") ||
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  );
}

export default function ProjectGallery({
  index,
  imageUrl,
  galleryImages,
  imageAlt,
  itemClasses,
  title,
  category,
  location,
  description,
  wide,
  tall,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeGalleryImages =
    galleryImages.length > 0 ? galleryImages : [imageUrl];

  const closeGallery = useCallback(() => {
    setIsOpen(false);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0
        ? safeGalleryImages.length - 1
        : current - 1
    );
  }, [safeGalleryImages.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === safeGalleryImages.length - 1
        ? 0
        : current + 1
    );
  }, [safeGalleryImages.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [isOpen, closeGallery, showPrevious, showNext]);

  const openGallery = () => {
    setActiveIndex(0);
    setIsOpen(true);
  };

  return (
    <div className={itemClasses}>
      <article
        className="portfolio-premium-card portfolio-gallery-trigger"
        style={{
          position: "relative",
          height: "100%",
          minHeight: tall ? "520px" : "390px",
          overflow: "hidden",
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ouvrir la galerie du projet ${title}`}
        onClick={openGallery}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openGallery();
          }
        }}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          unoptimized={isExternalImage(imageUrl)}
          sizes={
            wide
              ? "(max-width: 900px) 100vw, 66vw"
              : "(max-width: 900px) 100vw, 33vw"
          }
          style={{ objectFit: "cover" }}
        />

        <div className="portfolio-premium-overlay" />
        <div className="portfolio-premium-gradient" />

        <span className="portfolio-premium-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="portfolio-gallery-badge">
          <Images size={16} aria-hidden="true" />
          {safeGalleryImages.length > 1
            ? `${safeGalleryImages.length} photos`
            : "Voir la photo"}
        </span>

        <div className="portfolio-premium-content">
          <span className="portfolio-premium-category">
            {category}
          </span>

          <h3>{title}</h3>

          {description && (
            <p className="portfolio-project-description">
              {description}
            </p>
          )}

          {location && (
            <p className="portfolio-premium-location">
              <MapPin size={18} aria-hidden="true" />
              <span>{location}</span>
            </p>
          )}
        </div>
      </article>

      {isOpen && (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Galerie du projet ${title}`}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              closeGallery();
            }
          }}
        >
          <div className="project-lightbox-topbar">
            <div>
              <span>{category}</span>
              <strong>{title}</strong>
            </div>

            <div className="project-lightbox-counter">
              {activeIndex + 1} / {safeGalleryImages.length}
            </div>

            <button
              type="button"
              className="project-lightbox-close"
              onClick={closeGallery}
              aria-label="Fermer la galerie"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="project-lightbox-stage">
            {safeGalleryImages.length > 1 && (
              <button
                type="button"
                className="project-lightbox-arrow project-lightbox-arrow-left"
                onClick={showPrevious}
                aria-label="Photo précédente"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
            )}

            <div className="project-lightbox-image-wrap">
              <Image
                key={safeGalleryImages[activeIndex]}
                src={safeGalleryImages[activeIndex]}
                alt={`${title} — photo ${activeIndex + 1}`}
                fill
                priority
                unoptimized={isExternalImage(
                  safeGalleryImages[activeIndex]
                )}
                sizes="100vw"
                className="project-lightbox-image"
              />
            </div>

            {safeGalleryImages.length > 1 && (
              <button
                type="button"
                className="project-lightbox-arrow project-lightbox-arrow-right"
                onClick={showNext}
                aria-label="Photo suivante"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            )}
          </div>

          {safeGalleryImages.length > 1 && (
            <div className="project-lightbox-thumbnails">
              {safeGalleryImages.map((galleryImage, photoIndex) => (
                <button
                  key={`${galleryImage}-${photoIndex}`}
                  type="button"
                  className={
                    photoIndex === activeIndex
                      ? "project-lightbox-thumbnail active"
                      : "project-lightbox-thumbnail"
                  }
                  onClick={() => setActiveIndex(photoIndex)}
                  aria-label={`Afficher la photo ${photoIndex + 1}`}
                >
                  <Image
                    src={galleryImage}
                    alt=""
                    fill
                    unoptimized={isExternalImage(galleryImage)}
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
