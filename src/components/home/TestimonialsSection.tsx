"use client";

import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { fadeInUp, staggerContainer } from "@/lib/animation";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number; // 1..5
};

const testimonials: Testimonial[] = [
  {
    name: "Marie D.",
    role: "Membre depuis 2023",
    quote:
      "WatchListy a complètement transformé ma façon de gérer ma collection de films. L’interface est magnifique et les fonctionnalités sont exactement ce dont j’avais besoin.",
    rating: 5,
  },
  {
    name: "Thomas L.",
    role: "Cinéphile",
    quote:
      "Enfin une application qui comprend vraiment les besoins des amateurs de cinéma ! La fonction de recommandation est bluffante.",
    rating: 5,
  },
  {
    name: "Sophie M.",
    role: "Étudiante en cinéma",
    quote:
      "J’adore les listes personnalisées et le suivi de progression. Ça me fait gagner un temps fou pour mes projets de cours.",
    rating: 4,
  },
  {
    name: "Alex P.",
    role: "Sérivore",
    quote:
      "La recherche avancée et les filtres par genre/année sont super efficaces. UX clean et rapide, top !",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 text-yellow-400" aria-label={`${count} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className={i < count ? "opacity-100" : "opacity-30"} />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 sm:px-10 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que nos utilisateurs disent
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Des milliers de cinéphiles utilisent WatchListy pour organiser leurs films et séries au quotidien.
          </p>
        </motion.div>

        {/* Cartes témoignages */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t, idx) => (
            <motion.blockquote
              key={t.name}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.05 * idx }}
              className="h-full rounded-2xl border border-gray-800 bg-gray-800/60 backdrop-blur-sm p-6 shadow-sm"
            >
              <Stars count={t.rating} />
              <p className="mt-4 text-gray-200 leading-relaxed">
                “{t.quote}”
              </p>
              <footer className="mt-6 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
