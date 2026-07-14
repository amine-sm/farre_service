import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";


import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollProgress from "./components/ScrollProgress";
import WhatsAppButton from "./components/WhatsAppButton";
import "./globals.css";
import { Import } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
<html lang="fr" data-scroll-behavior="smooth"></html>
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EURL Farre Service | Travaux sous-marins",
    template: "%s | EURL Farre Service",
  },
  description:
    "Entreprise spécialisée dans les travaux sous-marins, maritimes, portuaires et hydrauliques en Algérie.",
  keywords: [
    "Farre Service",
    "travaux sous-marins",
    "inspection sous-marine",
    "travaux maritimes Algérie",
    "maintenance portuaire",
    "soudure sous-marine",
    "travaux hydrauliques",
    "Oran",
    "Arzew",
  ],
  openGraph: {
    title: "EURL Farre Service",
    description:
      "Expertise maritime, portuaire, hydraulique et sous-marine.",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/1.jpg",
        width: 1200,
        height: 630,
        alt: "EURL Farre Service",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#062e42",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <ScrollProgress />
        <Header />

        <main>{children}</main>

        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}