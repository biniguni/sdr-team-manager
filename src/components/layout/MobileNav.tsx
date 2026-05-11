import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/players", label: "Players" },
  { href: "/seasons", label: "Seasons" },
  { href: "/formations", label: "Forms" },
  { href: "/login", label: "Login" },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-slate-800 bg-slate-950 lg:hidden">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="px-2 py-3 text-center text-xs font-medium text-slate-300">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
