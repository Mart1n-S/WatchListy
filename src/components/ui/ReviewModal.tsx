"use client";

import { useState, useEffect } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number;
  onReviewAdded?: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  movieId,
  onReviewAdded,
}: ReviewModalProps) {
  const t = useTranslations("review.form");
  const [rating, setRating] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // --- Charger la review existante ---
  useEffect(() => {
    if (!isOpen || !movieId) return;

    const fetchExistingReview = async () => {
      try {
        const res = await fetch(`/api/reviews/${movieId}/mine`);
        if (!res.ok) return;

        const myReview = await res.json();

        if (myReview) {
          setRating(myReview.rating);
          setComment(myReview.comment);
          setEditMode(true);
        } else {
          setRating("");
          setComment("");
          setEditMode(false);
        }
      } catch (err) {
        console.error("Erreur lors du chargement de ma review :", err);
      }
    };

    fetchExistingReview();
  }, [isOpen, movieId]);

  // --- Validation simple ---
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!rating || rating < 1 || rating > 10) {
      newErrors.rating = t("invalidRating", {
        defaultValue: "Veuillez entrer une note entre 1 et 10.",
      });
    }
    if (!comment.trim()) {
      newErrors.comment = t("commentRequired", {
        defaultValue: "Veuillez entrer un commentaire.",
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Soumission ---
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const method = editMode ? "PATCH" : "POST";
      const url = editMode ? `/api/reviews/${movieId}` : "/api/reviews";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "review.alreadyExists") {
          toast.error(
            t("alreadyExists", {
              defaultValue: "Vous avez déjà commenté ce film.",
            })
          );
        } else {
          throw new Error("Erreur inconnue");
        }
      } else {
        toast.success(
          editMode
            ? t("updated", { defaultValue: "Avis mis à jour !" })
            : t("created", { defaultValue: "Avis ajouté !" })
        );
        onReviewAdded?.();
        onClose();
      }
    } catch (err) {
      console.error("Erreur lors de l’envoi de la review :", err);
      toast.error(
        t("error", { defaultValue: "Erreur lors de l’ajout de l’avis." })
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Suppression ---
  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews/${movieId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression de l’avis");
      }

      toast.success(
        t("deleted", { defaultValue: "Avis supprimé avec succès." })
      );
      onReviewAdded?.();
      onClose();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      toast.error(
        t("deleteError", { defaultValue: "Erreur lors de la suppression." })
      );
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* --- Modale principale --- */}
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-400 focus:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-md transition-all duration-200 hover:cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-white mb-4">
            {editMode
              ? t("editTitle", { defaultValue: "Modifier votre avis" })
              : t("title", { defaultValue: "Votre avis" })}
          </h2>

          {/* --- Note --- */}
          <label htmlFor="rating" className="block text-gray-300 text-sm mb-2">
            {t("rating", { defaultValue: "Note (sur 10)" })}
          </label>
          <input
            id="rating"
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => {
              setRating(
                e.target.value === "" ? "" : parseInt(e.target.value, 10)
              );
              setErrors((prev) => ({ ...prev, rating: undefined }));
            }}
            className={`w-full p-2 rounded-md bg-slate-800 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              errors.rating ? "border-rose-500" : "border-slate-700"
            } text-white mb-1`}
          />
          {errors.rating && (
            <p className="text-rose-400 text-sm mb-3">{errors.rating}</p>
          )}

          {/* --- Commentaire --- */}
          <label htmlFor="comment" className="block text-gray-300 text-sm mb-2">
            {t("comment", { defaultValue: "Commentaire" })}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setErrors((prev) => ({ ...prev, comment: undefined }));
            }}
            rows={4}
            className={`w-full p-2 rounded-md bg-slate-800 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              errors.comment ? "border-rose-500" : "border-slate-700"
            } text-white resize-none mb-1`}
          />
          {errors.comment && (
            <p className="text-rose-400 text-sm mb-3">{errors.comment}</p>
          )}

          {/* --- Boutons --- */}
          <div className="mt-6 flex justify-between items-center">
            {editMode && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="flex items-center gap-2 text-slate-400 text-sm hover:text-red-400 focus:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-md transition-all duration-200 ml-2 px-2 hover:cursor-pointer"
              >
                <FiTrash2 className="w-5 h-5" />
                {t("delete", { defaultValue: "Supprimer" })}
              </button>
            )}

            <div className="flex gap-3 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 hover:cursor-pointer"
              >
                {t("cancel", { defaultValue: "Annuler" })}
              </button>
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 hover:cursor-pointer"
              >
                {loading
                  ? t("loading", { defaultValue: "Envoi..." })
                  : editMode
                  ? t("update", { defaultValue: "Mettre à jour" })
                  : t("submit", { defaultValue: "Publier" })}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modale de confirmation de suppression --- */}
      <ConfirmDeleteModal
        isOpen={confirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        title={t("confirmDeleteTitle", { defaultValue: "Supprimer l’avis" })}
        message={t("confirmDeleteMessage", {
          defaultValue: "Voulez-vous vraiment supprimer votre avis ?",
        })}
      />
    </>
  );
}
