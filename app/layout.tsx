import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
});

const APPLE_SPLASH_SCREENS = [
  { url: "/splash/splash-750x1334.png", width: 375, height: 667, ratio: 2 },
  { url: "/splash/splash-1125x2436.png", width: 375, height: 812, ratio: 3 },
  { url: "/splash/splash-1170x2532.png", width: 390, height: 844, ratio: 3 },
  { url: "/splash/splash-1179x2556.png", width: 393, height: 852, ratio: 3 },
  { url: "/splash/splash-1284x2778.png", width: 428, height: 926, ratio: 3 },
  { url: "/splash/splash-1290x2796.png", width: 430, height: 932, ratio: 3 },
].map(({ url, width, height, ratio }) => ({
  url,
  media: `screen and (device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
}));

export const metadata: Metadata = {
  title: "VANTA",
  description: "Персональная панель управления повседневной жизнью",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VANTA",
    startupImage: APPLE_SPLASH_SCREENS,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
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
        <ServiceWorkerRegistration />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}