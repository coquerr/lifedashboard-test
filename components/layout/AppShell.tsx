"use client";

import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useFocusMode } from "@/components/layout/FocusModeContext";

export function AppShell({ children }: { children: ReactNode }) {
  const { isFocusMode } = useFocusMode();

  return (
    <div className="min-h-dvh bg-vanta-bg text-vanta-text md:flex">
      <div
        className={`overflow-hidden transition-[width,opacity] duration-500 ease-in-out ${
          isFocusMode ? "md:w-0 md:opacity-0" : "md:w-60 md:opacity-100"
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex min-h-dvh flex-1 flex-col">
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            isFocusMode ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <Header />
        </div>

        <main className="flex-1 px-4 pb-28 pt-6 md:px-10 md:pb-10 md:pt-10">
          {children}
        </main>
      </div>

      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isFocusMode ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <BottomNav />
      </div>
    </div>
  );
}