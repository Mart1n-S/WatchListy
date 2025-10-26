"use client";

import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { fadeInUp, staggerContainer } from "@/lib/animation";
import { useTranslations } from "next-intl";

function Stars({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-1 text-yellow-400"
      aria-label={`${count} sur 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className={i < count ? "opacity-100" : "opacity-30"} />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const t = useTranslations("home.testimonials");

  // Liste traduite via next-intl
  const testimonials = [
    {
      name: t("user1.name"),
      role: t("user1.role"),
      quote: t("user1.quote"),
      rating: 5,
    },
    {
      name: t("user2.name"),
      role: t("user2.role"),
      quote: t("user2.quote"),
      rating: 5,
    },
    {
      name: t("user3.name"),
      role: t("user3.role"),
      quote: t("user3.quote"),
      rating: 4,
    },
    {
      name: t("user4.name"),
      role: t("user4.role"),
      quote: t("user4.quote"),
      rating: 5,
    },
  ];

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
            {t("title")}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {t("subtitle")}
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
