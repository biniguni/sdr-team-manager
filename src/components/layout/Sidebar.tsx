import Link from "next/link";
import { logout } from "@/actions/auth";
import { getAuthStatus } from "@/lib/authz";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/lineup", label: "라인업" },
  { href: "/seasons", label: "Seasons" },
  { href: "/players", label: "Players" },
  { href: "/formations", label: "Formations" },
  { href: "/ranking", label: "Ranking" },
];

export async function Sidebar() {
  const { user, canEdit } = await getAuthStatus();

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-950 px-5 py-6 lg:block">
      <Link href="/" className="block text-xl font-bold tracking-wide text-slate-100">
        SDR Team
      </Link>
      <nav className="mt-8 grid gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 border-t border-slate-800 pt-4 text-sm text-slate-400">
        {user ? (
          <form action={logout} className="grid gap-2">
            <span>{canEdit ? "Editor mode" : "Signed in"}</span>
            <button type="submit" className="text-left font-semibold text-accent-blue">
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/login" className="font-semibold text-accent-blue">
            Editor login
          </Link>
        )}
      </div>
    </aside>
  );
}
