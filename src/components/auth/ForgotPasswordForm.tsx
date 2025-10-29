"use client";

import { useState, useRef } from "react";
import { HiMail } from "react-icons/hi";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";

export default function ForgotPasswordForm() {
  const t = useTranslations("auth.reset.request");
  const tForm = useTranslations("auth.reset.form");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (!email.trim()) {
      setFieldError(tForm("errors.emailRequired"));
      emailRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t("neutral"), { position: "top-right", duration: 5000 });
        setEmail("");
      } else if (data.error) {
        const cleanKey = String(data.error).replace(/^auth\.reset\.form\./, "");
        toast.error(
          tForm(`errors.${cleanKey}`) || tCommon("errors.unexpected")
        );
      } else {
        toast.error(tCommon("errors.unexpected"));
      }
    } catch (err) {
      console.error("Erreur de réinitialisation :", err);
      toast.error(tCommon("errors.internalServerError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl p-4 sm:p-8 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            {tForm("fields.email.label")}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                ${
                  fieldError
                    ? "border-red-600"
                    : "border-gray-700 hover:border-gray-600"
                }`}
            />
          </div>
          {fieldError && (
            <p className="mt-2 text-sm text-red-300">{fieldError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60 hover:cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0A12 12 0 000 12h4z"
                />
              </svg>
              {tForm("loading")}
            </>
          ) : (
            tForm("submit")
          )}
        </button>
      </form>
    </div>
  );
}
