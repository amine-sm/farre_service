import Link from "next/link";
import { ArrowLeft, Waves } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="not-found-page">
      <div className="container not-found-content">
        <Waves />

        <span>ERREUR 404</span>
        <h1>Cette page est introuvable</h1>

        <p>La page recherchée n’existe pas ou a été déplacée.</p>

        <Link href="/" className="button button-primary button-lg">
          <ArrowLeft size={19} />
          Retour à l’accueil
        </Link>
      </div>
    </section>
  );
}