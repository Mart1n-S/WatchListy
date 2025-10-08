import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "WatchListy | Gestion intelligente de vos films",
    template: "%s | WatchListy",
  },
  description:
    "Organisez, suivez et découvrez vos films et séries préférés avec WatchListy. La solution ultime pour les cinéphiles.",
  keywords: ["films", "séries", "watchlist", "cinéma", "organisation", "suivi"],
  authors: [{ name: "WatchListy Team" }],
  creator: "WatchListy",
  icons: {
    icon: [{ url: "/watchlisty-icon.svg", sizes: "16x16", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className={`${montserrat.className} antialiased min-h-dvh bg-gray-900 text-gray-100`}
      >
        <div className="flex flex-col min-h-dvh">
          <Header />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
