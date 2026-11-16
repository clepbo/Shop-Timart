import type { Metadata } from "next";
import { Alyamama, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Dock } from "@/components/layout/Dock";
import { NavProgress } from "@/components/layout/NavProgress";

// Brand guidelines: Alyamama for headings, IBM Plex Sans Arabic for body and captions.
const alyamama = Alyamama({
  variable: "--font-alyamama",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plex = IBM_Plex_Sans_Arabic({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: { default: `${brand.name} — ${brand.slogan}`, template: `%s · ${brand.name}` },
  metadataBase: new URL(`https://${brand.domain}`),
  description: brand.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${alyamama.variable} ${plex.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.word-in,.opacity-0{opacity:1!important}`}</style>
        </noscript>
        <CartProvider>
          <NavProgress />
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Dock />
        </CartProvider>
      </body>
    </html>
  );
}
