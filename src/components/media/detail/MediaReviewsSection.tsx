"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { FiMessageSquare, FiStar, FiTv } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { Review } from "@/models/Review";

interface MediaReviewsSectionProps {
  reviews: Review[];
  type: "movie" | "tv";
}

/**
 * Affiche la liste des avis pour un média (film ou série).
 * Lecture seule — pas de création/modification ici.
 */
export default function MediaReviewsSection({
  reviews,
  type,
}: MediaReviewsSectionProps) {
  const t = useTranslations("review");
  const locale = useLocale();
  const [visibleCount, setVisibleCount] = useState(3);

  const visibleReviews = reviews.slice(0, visibleCount);
  const showMore = () => setVisibleCount((prev) => prev + 3);
  const showLess = () => setVisibleCount(3);

  return (
    <section className="mt-12 max-w-6xl mx-auto px-4">
      {/* --- Titre --- */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {type === "movie" ? (
            <FiMessageSquare className="w-5 h-5 text-indigo-400" />
          ) : (
            <FiTv className="w-5 h-5 text-indigo-400" />
          )}
          {t("title", {
            defaultValue:
              type === "movie"
                ? "Avis des spectateurs"
                : "Avis des spectateurs (série)",
          })}
        </h2>
        {reviews.length > 0 && (
          <p className="text-slate-400 text-sm">
            {t("count", {
              count: reviews.length,
              defaultValue:
                reviews.length === 1 ? "1 avis" : `${reviews.length} avis`,
            })}
          </p>
        )}
      </div>

      {/* --- États --- */}
      {reviews.length === 0 && (
        <p className="text-gray-400 text-center py-6">
          {t("noReviews", {
            defaultValue:
              type === "movie"
                ? "Aucun avis pour ce film."
                : "Aucun avis pour cette série.",
          })}
        </p>
      )}

      {/* --- Liste des reviews --- */}
      {reviews.length > 0 && (
        <>
          <div className="space-y-6">
            <AnimatePresence>
              {visibleReviews.map((review, index) => (
                <motion.div
                  key={review._id ? review._id.toString() : index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-gray-900/40 rounded-xl p-4 shadow-sm hover:bg-gray-900/60 transition-all"
                >
                  {/* --- En-tête review --- */}
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href={`/${locale}/users/${review.userName}`}
                      className="flex items-center gap-3 hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-colors"
                    >
                      {review.userImage ? (
                        <Image
                          src={`/images/avatars/${review.userImage}`}
                          alt={review.userName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                          {review.userName?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-200 hover:text-indigo-400">
                          {review.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.updated_at).toLocaleDateString(
                            locale,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </Link>

                    <div className="ml-auto flex items-center gap-1 text-yellow-400">
                      <FiStar className="w-4 h-4 fill-yellow-400" />
                      <span className="font-medium">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* --- Boutons Voir plus / Voir moins --- */}
          <div className="flex justify-center mt-8 gap-3">
            {visibleCount < reviews.length && (
              <button
                onClick={showMore}
                className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 hover:cursor-pointer"
              >
                {t("showMore", { defaultValue: "Voir plus" })}
              </button>
            )}

            {visibleCount > 3 && (
              <button
                onClick={showLess}
                className="px-5 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-gray-200 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 hover:cursor-pointer"
              >
                {t("showLess", { defaultValue: "Voir moins" })}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
