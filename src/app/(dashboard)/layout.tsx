import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-bg-primary text-slate-100">
      <div className="flex min-w-0">
        <Sidebar />
        <main className="min-h-screen min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-7xl min-w-0">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
