import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const variants = {
  primary: "border-accent-blue bg-accent-blue text-slate-950 hover:bg-sky-300",
  secondary: "border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800",
  danger: "border-accent-red bg-transparent text-accent-red hover:bg-red-950",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
