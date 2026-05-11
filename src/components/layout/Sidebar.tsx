import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/players", label: "Players" },
  { href: "/seasons", label: "Seasons" },
  { href: "/formations", label: "Formations" },
  { href: "/ranking", label: "Ranking" },
];

export function Sidebar() {
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
    </aside>
  );
}
