import { getTranslations } from "next-intl/server";
import RegisterForm from "@/components/auth/RegisterForm";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.register.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.register" });

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

        <RegisterForm />
      </div>
    </div>
  );
}
