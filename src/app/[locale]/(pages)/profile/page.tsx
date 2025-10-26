"use client";

import { useSession } from "next-auth/react";
import { useAppSelector } from "@/lib/redux/hooks";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileBackground from "@/components/ui/ProfileBackground";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const { status } = useSession();
  const user = useAppSelector((state) => state.user);
  const t = useTranslations("profile");

  // État de chargement
  if (status === "loading" || !user.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ProfileBackground />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-slate-400">{t("subtitle")}</p>
        </div>

        {/* Le user vient directement du store Redux */}
        <ProfileCard user={user} />
      </div>
    </div>
  );
}
