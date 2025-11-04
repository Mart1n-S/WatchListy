import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProfileClient from "@/components/profile/ProfileClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a1a10] to-[#14052a]">
      {/* --- Contenu principal --- */}
      <div className="relative z-10 pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
        <p className="text-slate-400 mb-6">{t("subtitle")}</p>
        <ProfileClient />
      </div>
    </div>
  );
}
