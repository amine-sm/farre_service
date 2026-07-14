import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    "Bonjour EURL Farre Service, je souhaite obtenir des informations sur vos services."
  );

  return (
    <a
      href={`https://wa.me/213660952397?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-button"
      aria-label="Contacter Farre Service sur WhatsApp"
    >
      <MessageCircle />
      <span>WhatsApp</span>
    </a>
  );
}