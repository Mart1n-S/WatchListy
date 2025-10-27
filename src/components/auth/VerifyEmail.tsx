"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";
import BackgroundCinematic from "@/components/ui/BackgroundCinematic";

type VerifyStatus = "loading" | "success" | "expired" | "invalid" | "error";

export default function VerifyEmailClient() {
  const t = useTranslations("auth.verify");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerifyStatus>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok && data.status === "success") {
          setStatus("success");
          toast.success(t("successToast"), { duration: 6000 });
        } else if (data.code === "expired") {
          setStatus("expired");
        } else {
          setStatus("invalid");
        }
      } catch (err) {
        console.error("Erreur lors de la vérification :", err);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, t]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center text-gray-300">
            <p>{t("loading")}</p>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-emerald-400">
              {t("successTitle")}
            </h2>
            <p className="text-gray-300">{t("successText")}</p>
            <Link
              href={`/${locale}/login`}
              className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              {t("goToLogin")}
            </Link>
          </div>
        );

      case "expired":
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-400">
              {t("expiredTitle")}
            </h2>
            <p className="text-gray-300">{t("expiredText")}</p>
            <Link
              href={`/${locale}/resend-verification`}
              className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              {t("resendLink")}
            </Link>
          </div>
        );

      case "invalid":
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-red-400">
              {t("invalidTitle")}
            </h2>
            <p className="text-gray-300">{t("invalidText")}</p>
            <Link
              href={`/${locale}/resend-verification`}
              className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              {t("resendLink")}
            </Link>
          </div>
        );

      default:
        return (
          <div className="text-center text-red-400">
            <p>{t("errorText")}</p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-5rem)] flex items-center justify-center px-4 py-10">
      <BackgroundCinematic />
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
}
