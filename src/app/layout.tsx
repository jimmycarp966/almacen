import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { NotificationSetup } from "@/components/layout/NotificationSetup";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Super Aguilares - Sistema de Supermercado Argentino",
  description: "Sistema de ventas por catálogo para Super Aguilares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
        <meta name="theme-color" content="#E60000" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${manrope.variable} font-sans antialiased bg-background-light text-text-main overflow-x-hidden`}
      >
        <NotificationSetup />
        {children}
      </body>
    </html>
  );
}
