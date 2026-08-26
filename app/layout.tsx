import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "VANTA",
  description: "Персональная панель управления повседневной жизнью",
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-dvh bg-vanta-bg font-sans text-vanta-text antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}