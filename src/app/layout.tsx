
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Plantitis Informativa",
    template: "%s | Plantitis Informativa",
  },

  description:
    "Explora Plantitis Informativa, una enciclopedia botánica con información sobre especies vegetales, características, distribución, cuidados y usos documentados.",

  applicationName: "Plantitis Informativa",

  openGraph: {
    title: "Plantitis Informativa",
    description:
      "Conoce especies vegetales, sus características, cuidados, distribución y usos documentados.",
    url: siteUrl,
    siteName: "Plantitis Informativa",
    locale: "es_SV",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Plantitis Informativa",
    description:
      "Una enciclopedia botánica dedicada al conocimiento de las plantas.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
