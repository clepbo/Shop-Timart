import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Studio", robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell logout={logout}>{children}</AdminShell>;
}
