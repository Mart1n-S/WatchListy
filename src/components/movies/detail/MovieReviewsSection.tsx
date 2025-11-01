"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiMessageSquare, FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import type { Review } from "@/models/Review";

/**
 * Affiche la liste des avis pour un film.
 * Lecture seule — pas de création/modification ici.
 */
export default function MovieReviewsSection({ movieId }: { movieId: number }) {
  const t = useTranslations("review");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews/${movieId}`, {
          next: { revalidate: 60 }, // légère optimisation de cache
        });
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Erreur lors du chargement des avis :", err);
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [movieId, t]);

  return (
    <section className="mt-12 max-w-6xl mx-auto px-4">
      {/* --- Titre --- */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FiMessageSquare className="w-5 h-5 text-indigo-400" />
        {t("title")}
      </h2>

      {/* --- Chargement --- */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-900/40 rounded-xl p-4 animate-pulse flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-gray-700 rounded" />
                <div className="h-3 w-1/2 bg-gray-700 rounded" />
                <div className="h-3 w-full bg-gray-700 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Erreur --- */}
      {!loading && error && (
        <p className="text-red-400 text-center py-6">{error}</p>
      )}

      {/* --- Aucune review --- */}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-gray-400 text-center py-6">{t("noReviews")}</p>
      )}

      {/* --- Liste des reviews --- */}
      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id ? review._id.toString() : index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-gray-900/40 rounded-xl p-4 shadow-sm hover:bg-gray-900/60 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                {review.userImage ? (
                  <Image
                    src={review.userImage}
                    alt={review.userName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-semibold text-gray-200">
                    {review.userName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.updated_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-yellow-400">
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
        </div>
      )}
    </section>
  );
}
