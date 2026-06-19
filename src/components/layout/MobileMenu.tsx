"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/actions/auth";

type NavLink = {
  href: string;
  label: string;
};

export function MobileMenu({
  links,
  user,
  canEdit,
}: {
  links: NavLink[];
  user: boolean;
  canEdit: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (panelRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-slate-800 bg-slate-950 lg:hidden">
      <div ref={panelRef}>
        <button
          type="button"
          className="flex min-h-14 w-full items-center justify-between px-4 text-left text-base font-semibold text-slate-100"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span>SDR Team</span>
          <span className={`rounded-md border px-3 py-1.5 text-sm text-slate-300 ${open ? "border-accent-blue" : "border-slate-700"}`}>
            메뉴
          </span>
        </button>
        {open ? (
          <div className="grid max-h-[calc(100vh-3.5rem)] gap-6 overflow-y-auto border-t border-slate-800 px-4 py-5">
            <nav className="grid gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-3 text-base font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-slate-800 pt-4 text-base text-slate-400">
              {user ? (
                <form action={logout} className="grid gap-2">
                  <span>{canEdit ? "Editor mode" : "로그인됨"}</span>
                  <button type="submit" className="text-left font-semibold text-accent-blue">
                    로그아웃
                  </button>
                </form>
              ) : (
                <Link href="/login" className="font-semibold text-accent-blue" onClick={() => setOpen(false)}>
                  Editor login
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
