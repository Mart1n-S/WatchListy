"use client";

import { useTranslations } from "next-intl";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";
import ResendForm from "@/components/auth/ResendForm";

export default function ResendVerificationPage() {
  const t = useTranslations("auth.verify.resend");

  return (
    <div className="relative min-h-[calc(100dvh-5rem)] flex items-center justify-center px-4 py-10">
      <BackgroundCinematic />

      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-white mb-4">{t("title")}</h1>
        <p className="text-gray-400 mb-6">{t("description")}</p>

        <ResendForm />
      </div>
    </div>
  );
}
