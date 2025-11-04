import UsersList from "@/components/users/UsersList";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("users");
  return {
    title: t("pageTitle", { defaultValue: "Utilisateurs populaires" }),
  };
}

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "users" });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a1a10] to-[#14052a]">
      {/* --- Contenu principal --- */}
      <div className="relative z-10 pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
        <p className="text-slate-400 mb-6">{t("subtitle")}</p>
        <UsersList />
      </div>
    </div>
  );
}
