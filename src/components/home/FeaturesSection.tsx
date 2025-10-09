"use client";

import { motion } from "framer-motion";
import { FiSearch, FiCheckCircle, FiStar, FiFilm } from "react-icons/fi";
import { FaImdb } from "react-icons/fa";
import { fadeInUp, staggerContainer } from "@/lib/animation";

export function FeaturesSection() {
  return (
    // {/* Section Fonctionnalités */}
    <section className="py-20 px-6 sm:px-10 bg-gray-900" id="features">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Tout ce dont vous avez besoin pour{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
            gérer vos films
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-center text-gray-300 max-w-3xl mx-auto mb-16"
        >
          WatchListy combine toutes les fonctionnalités essentielles pour suivre vos films et séries préférés en un seul endroit élégant et intuitif.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-10 md:grid-cols-3"
        >
          {[
            {
              icon: <FiSearch className="w-8 h-8 text-blue-500" />,
              title: "Recherche intelligente",
              description:
                "Trouvez instantanément n'importe quel film ou série grâce à notre base de données complète et notre système de suggestion avancé.",
              gradient: "from-blue-500/10 to-blue-200/10",
            },
            {
              icon: <FiCheckCircle className="w-8 h-8 text-emerald-500" />,
              title: "Suivi de visionnage",
              description:
                "Marquez les films que vous avez vus, ceux que vous voulez voir, et suivez votre progression avec des statistiques détaillées.",
              gradient: "from-emerald-500/10 to-emerald-200/10",
            },
            {
              icon: <FiStar className="w-8 h-8 text-amber-500" />,
              title: "Notation et avis",
              description:
                "Notez vos films préférés, écrivez des avis et découvrez les recommandations de notre communauté passionnée.",
              gradient: "from-amber-500/10 to-amber-200/10",
            },
            {
              icon: <FiFilm className="w-8 h-8 text-purple-500" />,
              title: "Listes personnalisées",
              description:
                "Créez des listes thématiques (à regarder, favoris, par genre) et organisez votre collection comme vous le souhaitez.",
              gradient: "from-purple-500/10 to-purple-200/10",
            },
            {
              icon: <FaImdb className="w-8 h-8 text-yellow-500" />,
              title: "Intégration IMDB",
              description:
                "Accédez aux notes IMDB, aux synopsis complets et aux informations détaillées directement depuis notre plateforme.",
              gradient: "from-yellow-500/10 to-yellow-200/10",
            },
            {
              icon: (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              ),
              title: "Recommandations",
              description:
                "Recevez des suggestions personnalisées basées sur vos goûts et votre historique de visionnage.",
              gradient: "from-pink-500/10 to-rose-200/10",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`p-8 rounded-2xl border border-gray-800 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm`}
            >
              <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-xl bg-gray-800 shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-300 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
