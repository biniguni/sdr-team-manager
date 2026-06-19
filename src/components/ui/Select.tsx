import type { SelectHTMLAttributes } from "react";

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`min-h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-accent-blue sm:text-sm ${className}`}
      {...props}
    />
  );
}
