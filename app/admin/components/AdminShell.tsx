"use client";

import { usePathname } from "next/navigation";

import AdminNavbar from "./AdminNavbar";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/connexion";

  if (isLoginPage) {
    return (
      <div className="admin-auth-shell">
        {children}
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <AdminNavbar />

      <div className="admin-shell-content">
        {children}
      </div>
    </div>
  );
}
