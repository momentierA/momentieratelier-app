import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Momentier Atelier",
  description: "Momentier Atelier — Sistema de gestão",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Momentier Atelier",
  },
  icons: {
    apple: "/icons/icon-apple.png",
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
    <html lang="pt-BR" className={`${jakarta.variable} antialiased`}>
      <body className="bg-brand-cream">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
