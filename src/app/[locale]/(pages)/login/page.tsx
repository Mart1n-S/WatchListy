import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";

// --- Traduction dynamique des métadonnées ---
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.login.meta" });

  return {
    title: t("title"),
  };
}

// --- Page principale ---
export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.login" });

  return (
    <div className="relative min-h-[calc(100dvh-5rem)] flex items-center justify-center px-4 py-10">
      <BackgroundCinematic />

      <div className="w-full max-w-md">
        {/* En-tête compact */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center">
            <Image
              src="/watchlisty-icon.svg"
              alt="Logo WatchListy"
              width={64}
              height={64}
              className="h-16 w-16"
              sizes="64px"
            />
          </div>
          <h1 className="mt-4 text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-gray-200">{t("subtitle")}</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
