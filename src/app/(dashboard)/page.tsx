export default function DashboardHome() {
  return (
    <main className="min-h-screen bg-bg-primary px-6 py-8 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-accent-blue">Phase 0</p>
          <h1 className="mt-2 text-3xl font-semibold">SDR Team Manager</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            The Next.js app shell is running. Supabase utilities, shared types,
            Tailwind theme tokens, and the planned source directory structure
            are ready for the first product features.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Players", "Register and manage team members."],
            ["Seasons", "Group squads and matches by season."],
            ["Lineups", "Assign players to period-specific positions."],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-lg border border-slate-700 bg-bg-secondary p-5"
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
