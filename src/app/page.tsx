"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  return (
    <section className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-6 pt-20 pb-16 bg-gradient-to-b from-indigo-500/10 to-transparent">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold mb-4"
        >
          <span className="text-indigo-600 dark:text-indigo-400">WatchListy</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-8"
        >
          Gérez vos films et séries préférés en toute simplicité.  
          Suivez ce que vous avez vu, ce que vous voulez regarder,  
          et découvrez de nouvelles pépites !
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/login"
            className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            S’inscrire
          </Link>
        </motion.div>
      </section>

      {/* Section fonctionnement */}
      <section className="py-16 px-6 sm:px-20 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-semibold text-center mb-10"
        >
          Comment ça marche ?
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-10 sm:grid-cols-3 max-w-6xl mx-auto text-center"
        >
          {[
            {
              number: "1",
              title: "Crée ton compte",
              text: "Inscris-toi gratuitement pour commencer à créer ta liste de films et séries.",
            },
            {
              number: "2",
              title: "Ajoute tes favoris",
              text: "Recherche et ajoute facilement les titres que tu aimes ou que tu veux découvrir.",
            },
            {
              number: "3",
              title: "Suis ta progression",
              text: "Marque ce que tu as vu, note tes films, et découvre des recommandations personnalisées.",
            },
          ].map((item) => (
            <motion.div
              key={item.number}
              variants={fadeInUp}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-2xl font-bold mb-4">
                {item.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </section>
  );
}
