"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  followUser,
  unfollowUser,
  fetchFollowingUsers,
} from "@/lib/redux/thunks/followThunks";
import { FiUserPlus, FiUserMinus, FiLoader } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function UserFollowingSection() {
  const t = useTranslations("profile.following");
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.following);
  const [pseudo, setPseudo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchFollowingUsers());
  }, [dispatch]);

  // Ajouter un utilisateur à suivre
  const handleFollow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) {
      toast.error(t("errors.emptyPseudo"));
      return;
    }

    setIsSubmitting(true);
    const success = await dispatch(followUser(pseudo.trim()));

    if (success) {
      toast.success(t("success.followed", { pseudo }));
      setPseudo("");
    } else {
      toast.error(t("errors.followFailed"));
    }
    setIsSubmitting(false);
  };

  // Se désabonner
  const handleUnfollow = async (userId: string, pseudo: string) => {
    const success = await dispatch(unfollowUser(userId));
    if (success) {
      toast.success(t("success.unfollowed", { pseudo }));
    } else {
      toast.error(t("errors.unfollowFailed"));
    }
  };

  return (
    <section className="mt-10">
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          {t("title", { defaultValue: "Abonnements" })}
        </h2>

        {/* Formulaire d'ajout */}
        <form onSubmit={handleFollow} className="flex items-center gap-3 mb-6">
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder={t("placeholders.enterPseudo")}
            className="flex-1 bg-gray-800 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center sm:justify-start gap-2 px-5 py-2 rounded-lg text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
              ${
                isSubmitting
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:cursor-pointer"
              }`}
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">{t("buttons.loading")}</span>
              </>
            ) : (
              <>
                <FiUserPlus className="w-5 h-5" />
                <span className="hidden sm:inline">{t("buttons.follow")}</span>
              </>
            )}
          </button>
        </form>

        {/* Liste des suivis */}
        {loading ? (
          <div className="text-gray-400">{t("loading")}</div>
        ) : users.length === 0 ? (
          <p className="text-gray-500">{t("empty")}</p>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg hover:bg-gray-900 transition-all"
              >
                <Link
                  href={`/${locale}/users/${user.pseudo}`}
                  className="flex items-center gap-3 hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-colors"
                >
                  <Image
                    src={`/images/avatars/${user.avatar || "default.png"}`}
                    alt={user.pseudo}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-200">
                    {user.pseudo}
                  </span>
                </Link>

                <button
                  onClick={() => handleUnfollow(user._id, user.pseudo)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <FiUserMinus className="w-4 h-4" />
                  {t("buttons.unfollow")}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
