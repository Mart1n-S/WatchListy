"use client";

import { motion } from "framer-motion";
import { FiSearch, FiCheckCircle, FiStar, FiFilm } from "react-icons/fi";
import { FaImdb } from "react-icons/fa";
import { staggerContainer } from "@/lib/animation";
import { useTranslations } from "next-intl";
import { FeatureCard } from "@/components/home/FeatureCard";

export function FeaturesSection() {
  const t = useTranslations("home.features");

  const features = [
    {
      icon: <FiSearch className="w-8 h-8 text-blue-500" />,
      title: t("feature1.title"),
      description: t("feature1.description"),
      gradient: "from-blue-500/10 to-blue-200/10",
    },
    {
      icon: <FiCheckCircle className="w-8 h-8 text-emerald-500" />,
      title: t("feature2.title"),
      description: t("feature2.description"),
      gradient: "from-emerald-500/10 to-emerald-200/10",
    },
    {
      icon: <FiStar className="w-8 h-8 text-amber-500" />,
      title: t("feature3.title"),
      description: t("feature3.description"),
      gradient: "from-amber-500/10 to-amber-200/10",
    },
    {
      icon: <FiFilm className="w-8 h-8 text-purple-500" />,
      title: t("feature4.title"),
      description: t("feature4.description"),
      gradient: "from-purple-500/10 to-purple-200/10",
    },
    {
      icon: <FaImdb className="w-8 h-8 text-yellow-500" />,
      title: t("feature5.title"),
      description: t("feature5.description"),
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
      title: t("feature6.title"),
      description: t("feature6.description"),
      gradient: "from-pink-500/10 to-rose-200/10",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-10 bg-gray-900" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Titre section */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          {t.rich("title", {
            highlight: (chunk) => (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                {chunk}
              </span>
            ),
          })}
        </motion.h2>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-center text-gray-300 max-w-3xl mx-auto mb-16"
        >
          {t("subtitle")}
        </motion.p>

        {/* Grid des features */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
