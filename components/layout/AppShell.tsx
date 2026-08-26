import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-vanta-bg text-vanta-text md:flex">
      <Sidebar />

      <div className="flex min-h-dvh flex-1 flex-col">
        <Header />

        <main className="flex-1 px-4 pb-28 pt-6 md:px-10 md:pb-10 md:pt-10">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}