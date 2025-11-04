import { Suspense } from "react";
import VerifyEmailClient from "@/components/auth/VerifyEmail";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// --- Traduction dynamique des métadonnées ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "auth.verify.meta",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mb-4" />
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
