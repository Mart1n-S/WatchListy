import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ProfileEditClient from "@/components/profile/ProfileEditClient";

/* ---------------------- MÉTADONNÉES SEO ---------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProfileEdit.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
/* ---------------------- PAGE PRINCIPALE (SERVER) ---------------------- */
export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProfileEdit" });

  return (
    <div className="min-h-screen relative">
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-4">{t("title")}</h1>
        <p className="text-slate-400 mb-8">{t("subtitle")}</p>

        <ProfileEditClient />
      </div>
    </div>
  );
}
