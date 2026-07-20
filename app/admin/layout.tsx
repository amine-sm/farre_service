import type { Metadata } from "next";

import AdminShell from "./components/AdminShell";

import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Administration",
    template: "%s | Administration Farre Service",
  },

  description:
    "Espace d’administration sécurisé de Farre Service.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
