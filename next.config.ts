import type { NextConfig } from "next";
import withPWAInit from "next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

// Spécifiez le chemin vers votre fichier de configuration
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
// Configuration PWA
const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

// Config principale Next.js
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["watch-listy-one.vercel.app"],
  },
};

// Combine next-intl + next-pwa
export default withNextIntl(withPWA(nextConfig));