"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProfileBackground from "@/components/ui/ProfileBackground";
import { useTranslations } from "next-intl";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("ProfileEdit");

  // Redirige si non connecté
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // État de chargement
  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ProfileBackground />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-4">{t("title")}</h1>
        <p className="text-slate-400 mb-8">{t("subtitle")}</p>

        <ProfileEditForm user={session.user} />
      </div>
    </div>
  );
}
