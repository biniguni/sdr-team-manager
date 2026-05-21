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

export async function MobileNav() {
  const { user, canEdit } = await getAuthStatus();

  return (
    <details className="group fixed inset-x-0 top-0 z-40 border-b border-slate-800 bg-slate-950 lg:hidden">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-slate-100 marker:hidden">
        <span>SDR Team</span>
        <span className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-300 group-open:border-accent-blue">
          Menu
        </span>
      </summary>
      <div className="grid max-h-[calc(100vh-3.5rem)] gap-6 overflow-y-auto border-t border-slate-800 px-4 py-5">
        <nav className="grid gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-800 pt-4 text-sm text-slate-400">
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
      </div>
    </details>
  );
}
