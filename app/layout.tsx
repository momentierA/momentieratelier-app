import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Momentier Atelier",
  description: "Momentier Atelier — Sistema de gestão",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Momentier Atelier",
  },
  icons: {
    apple: "/icons/icon-180.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#8A2822",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} antialiased`}>
      <body className="bg-brand-cream">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
