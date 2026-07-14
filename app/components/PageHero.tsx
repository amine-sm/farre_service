import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type PageHeroProps = {
  title: string;
  description: string;
  image: string;
  currentPage: string;
};

export default function PageHero({
  title,
  description,
  image,
  currentPage,
}: PageHeroProps) {
  return (
    <section
      className="page-hero"
      style={{
        position: "relative",
        minHeight: "560px",
        overflow: "hidden",
      }}
    >
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="page-hero-image"
        style={{
          objectFit: "cover",
        }}
      />

      <div className="page-hero-overlay" />
      <div className="page-hero-grid" />
      <div className="page-hero-circle" />

      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">
            <Home size={15} />
            Accueil
          </Link>

          <ChevronRight size={14} />
          <span>{currentPage}</span>
        </div>

        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}