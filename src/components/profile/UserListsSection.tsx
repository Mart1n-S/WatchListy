"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { FiList, FiPlayCircle, FiCheckCircle } from "react-icons/fi";
import { HiEye } from "react-icons/hi";

export default function UserListsSection() {
  const router = useRouter();
  const t = useTranslations("userMovies.lists");
  const locale = useLocale();

  const lists = [
    {
      key: "watchlist",
      title: t("watchlist.title"),
      description: t("watchlist.description"),
      icon: <FiList className="w-8 h-8 text-blue-500" />,
      gradient: "from-blue-500/10 to-blue-200/10",
      border: "border-blue-500/30",
      focus: "focus:ring-blue-500",
    },
    {
      key: "watching",
      title: t("watching.title"),
      description: t("watching.description"),
      icon: <FiPlayCircle className="w-8 h-8 text-amber-500" />,
      gradient: "from-amber-500/10 to-amber-200/10",
      border: "border-amber-500/30",
      focus: "focus:ring-amber-500",
    },
    {
      key: "completed",
      title: t("completed.title"),
      description: t("completed.description"),
      icon: <FiCheckCircle className="w-8 h-8 text-emerald-500" />,
      gradient: "from-emerald-500/10 to-emerald-200/10",
      border: "border-emerald-500/30",
      focus: "focus:ring-emerald-500",
    },
  ];

  return (
    <section className="mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* --- Titre --- */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
        {t("sectionTitle", { defaultValue: "Mes listes" })}
      </h2>

      {/* --- Grille responsive --- */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((list, index) => (
          <motion.div
            key={list.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`
              relative flex flex-col justify-between rounded-2xl
              p-5 sm:p-6
              bg-gradient-to-br ${list.gradient}
              border ${list.border} shadow-md sm:shadow-lg
              transition-all duration-300
            `}
          >
            {/* --- Icône + Titre --- */}
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-800/60 flex-shrink-0">
                {list.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">
                {list.title}
              </h3>
            </div>

            {/* --- Description --- */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6 line-clamp-3">
              {list.description}
            </p>

            {/* --- Bouton Voir --- */}
            <button
              onClick={() => router.push(`/${locale}/profile/${list.key}`)}
              className={`
                relative flex items-center justify-center gap-2
                w-full py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base
                bg-gradient-to-r ${list.gradient}
                text-white border ${list.border}
                transition-all duration-300 transform
                hover:scale-[1.02] active:scale-[0.98]
                shadow-md hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${list.focus}
                group overflow-hidden hover:cursor-pointer
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <HiEye className="w-5 h-5 relative flex-shrink-0" />
              <span className="relative">{t("seeMore")}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
