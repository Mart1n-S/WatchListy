"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiUserPlus, FiShield } from "react-icons/fi";
import { fadeInUp, gradientBackground } from "@/lib/animation";
import { useTranslations } from "next-intl";

export function CtaSection() {
  const t = useTranslations("home.cta");

  return (
    <section
      className="relative py-20 px-6 sm:px-10 overflow-hidden"
      style={gradientBackground}
    >
      {/* Halo décoratif */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm p-10 text-center shadow-lg"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center px-3 py-1 mb-5 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300"
          >
            🚀 {t("badge")}
          </motion.span>

          {/* Titre */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            {t("title")}
          </motion.h2>

          {/* Sous-titre */}
          <motion.p
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-gray-300 max-w-2xl mx-auto mb-8"
          >
            {t("subtitle")}
          </motion.p>

          {/* Indicateur social */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.15 }}
            className="mb-6 text-sm text-gray-400"
          >
            <span className="font-semibold text-blue-400">
              12,345+
            </span>{" "}
            {t("trustedText")}
          </motion.div>

          {/* Boutons */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-gradient-to-r text-white font-medium shadow from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <FiUserPlus className="mr-2" />
              {t("cta")}
            </Link>
          </motion.div>

          {/* Footer de confiance */}
          <motion.div
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400"
          >
            <FiShield />
            <span>{t("privacy")}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
