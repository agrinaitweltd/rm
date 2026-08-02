import type { Metadata } from "next";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/admin-auth";
import AdminLogin from "../../AdminLogin";
import LogoutButton from "../../LogoutButton";
import StoreConnectionPanel from "./StoreConnectionPanel";
import "../../admin.css";

export const metadata: Metadata = {
  title: "Store Connection — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function StoreConnectionPage() {
  const authed = await isAdminAuthed();
  if (!authed) {
    return <AdminLogin />;
  }

  return (
    <div className="rm-admin">
      <header className="rm-admin-topbar">
        <h1>
          <Link href="/admin" className="rm-admin-breadcrumb-link">
            RM Mangoes Admin
          </Link>
          <span className="rm-admin-breadcrumb-sep">/</span>
          Settings
          <span className="rm-admin-breadcrumb-sep">/</span>
          Store Connection
        </h1>
        <div className="rm-admin-topbar-right">
          <LogoutButton />
        </div>
      </header>
      <StoreConnectionPanel />
    </div>
  );
}
