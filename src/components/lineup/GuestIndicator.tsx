export function GuestIndicator({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="용병"
      title="용병"
      className={`inline-block h-2 w-2 shrink-0 rounded-full bg-accent-blue ring-2 ring-sky-400/20 ${className}`}
    />
  );
}
