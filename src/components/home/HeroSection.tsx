"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiFilm, FiCheckCircle, FiStar, FiUserPlus } from "react-icons/fi";
import { fadeInUp, gradientBackground } from "@/lib/animation";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations("home.hero");
  const locale = useLocale();

  const variants = prefersReducedMotion
    ? { visible: { opacity: 1 }, hidden: { opacity: 0 } }
    : fadeInUp;

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 overflow-hidden"
      style={gradientBackground}
      aria-labelledby="hero-title"
    >
      {/* Dégradé subtil en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-emerald-500/5 to-purple-500/5" />

      {/* Conteneur principal */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge "Nouveau" */}
        <motion.div
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-blue-900/30 text-blue-300 text-sm font-medium"
        >
          <FiFilm className="mr-1" aria-hidden="true" />
          {t("badge")}
        </motion.div>

        {/* Titre principal */}
        <motion.h1
          id="hero-title"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-400"
        >
          {t("title")}
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
        >
          {t.rich("subtitle", {
            highlight: (chunk) => (
              <span className="font-semibold text-blue-400">{chunk}</span>
            ),
          })}
        </motion.p>

        {/* Bouton d'action */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link
            href={`/${locale}/register`}
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-lg group bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition duration-300" />
            <FiUserPlus className="mr-2" aria-hidden="true" />
            {t("cta")}
          </Link>
        </motion.div>

        {/* Illustration/placeholder pour l'héro */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative w-full max-w-3xl h-64 mx-auto bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl overflow-hidden shadow-xl"
          aria-hidden="true"
        >
          {/* --- Cartes d'affiches --- */}
          <div className="absolute inset-0 flex items-center justify-center -translate-y-6 sm:-translate-y-8">
            <div className="flex space-x-4">
              {[
                "/images/hero-posters/demonSalyer.webp",
                "/images/hero-posters/ca.webp",
                "/images/hero-posters/strangerThings.webp",
                "/images/hero-posters/f1.webp",
                "/images/hero-posters/4F.webp",
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative w-20 h-32 sm:w-24 sm:h-36 md:w-28 md:h-40 rounded-lg overflow-hidden shadow-lg transform transition-transform will-change-transform"
                  style={{
                    transform: `rotate(${i * 8 - 20}deg)`,
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 80px, (max-width: 1024px) 100px, 120px"
                    className="object-cover rounded-lg"
                    priority={i === 2}
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* --- Bandeau infos --- */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2 bg-gray-800/90 backdrop-blur-sm rounded-lg text-gray-100">
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="text-green-400" aria-hidden="true" />
              <span className="text-sm font-medium">{t("stats.followed")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiStar className="text-blue-400" aria-hidden="true" />
              <span className="text-sm font-medium">{t("stats.reviews")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
