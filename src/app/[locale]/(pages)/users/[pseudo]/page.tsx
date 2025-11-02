import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import PublicProfileClient from "@/components/profile/PublicProfileClient";
import { GradientBackground } from "@/components/ui/GradientBackground";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pseudo: string }>;
}): Promise<Metadata> {
  const { locale, pseudo } = await params;
  const t = await getTranslations({ locale, namespace: "publicProfile.meta" });

  return {
    title: `${t("title")} – ${pseudo}`,
    description: t("description", { pseudo }),
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ locale: string; pseudo: string }>;
}) {
  const { pseudo } = await params;
  return (
    <GradientBackground>
      <PublicProfileClient pseudo={pseudo} />
    </GradientBackground>
  );
}
