"use client";

import { usePathname } from "next/navigation";

import Footer from "./Footer";
import Header from "./Header";
import ScrollProgress from "./ScrollProgress";
import WhatsAppButton from "./WhatsAppButton";

interface ApplicationLayoutProps {
  children: React.ReactNode;
}

export default function ApplicationLayout({
  children,
}: ApplicationLayoutProps) {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />

      <Header />

      <main>{children}</main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}