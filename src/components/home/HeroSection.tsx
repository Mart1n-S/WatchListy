"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiFilm, FiCheckCircle, FiStar, FiUserPlus } from "react-icons/fi";
import { FaImdb } from "react-icons/fa";
import { fadeInUp, gradientBackground } from "@/lib/animation";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const variants = prefersReducedMotion
    ? { visible: { opacity: 1 }, hidden: { opacity: 0 } }
    : fadeInUp;

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 overflow-hidden"
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
          Nouveau — Gestion intelligente de vos films
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
          WatchListy
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
        >
          Votre <span className="font-semibold text-blue-400">compagnon ultime</span> pour suivre,
          organiser et découvrir vos films et séries préférés.
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
            href="/register"
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-lg group bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition duration-300" />
            <FiUserPlus className="mr-2" aria-hidden="true" />
            Commencer gratuitement
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
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-32 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-lg opacity-80 transition-transform will-change-transform"
                  style={{ transform: `rotate(${i * 8 - 20}deg)` }}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2 bg-gray-800/90 backdrop-blur-sm rounded-lg text-gray-100">
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="text-green-400" aria-hidden="true" />
              <span className="text-sm font-medium">124 films suivis</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaImdb className="text-yellow-400" aria-hidden="true" />
              <span className="text-sm font-medium">8.2/10</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiStar className="text-blue-400" aria-hidden="true" />
              <span className="text-sm font-medium">42 avis</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
