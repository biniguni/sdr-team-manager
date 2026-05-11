import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "green" | "red" | "blue" }) {
  const tones = {
    default: "border-slate-600 text-slate-300",
    green: "border-accent-green text-accent-green",
    red: "border-accent-red text-accent-red",
    blue: "border-accent-blue text-accent-blue",
  };

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
