import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-lg border border-slate-800 bg-bg-secondary p-6">
        <div className="mb-6">
          <p className="text-sm font-semibold text-accent-blue">SANDRO FC</p>
          <h1 className="mt-2 text-2xl font-bold">Operator login</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sign in with a Supabase Auth account to manage team records.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
