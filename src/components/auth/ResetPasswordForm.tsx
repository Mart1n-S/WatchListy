"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HiEye, HiEyeOff, HiMail, HiLockClosed } from "react-icons/hi";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { z } from "zod";

import {
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validators/resetPassword";

import { useFieldValidation } from "@/lib/utils/useFieldValidation";

/** Gestion des erreurs par champ */
type FieldErrors = Partial<Record<keyof ResetPasswordInput, string>>;

export default function ResetPasswordForm() {
  const t = useTranslations("auth.reset.form");
  const tCommon = useTranslations("common");

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "fr";

  const token = searchParams.get("token");

  /** État du formulaire */
  const [values, setValues] = useState<ResetPasswordInput>({
    email: "",
    password: "",
    confirmPassword: "",
    token: token || "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  /** Refs pour focus sur le premier champ en erreur */
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  const focusFirstError = (errs: FieldErrors) => {
    if (errs.email) emailRef.current?.focus();
    else if (errs.password) passwordRef.current?.focus();
    else if (errs.confirmPassword) confirmRef.current?.focus();
  };

  /** Hook de validation champ-par-champ */
  const { handleChangeValidation } = useFieldValidation(
    ResetPasswordSchema,
    values,
    setFieldErrors,
    t,
    ["confirmPassword"] // champs à validation croisée
  );

  /** Gestion des changements de champ */
  const handleChange = <K extends keyof ResetPasswordInput>(
    field: K,
    value: ResetPasswordInput[K]
  ) => {
    setValues((v) => ({ ...v, [field]: value }));
    handleChangeValidation(field, value);
  };

  /** Critères de sécurité du mot de passe */
  const passwordCriteria = [
    {
      label: t("passwordCriteria.length"),
      valid: !!values.password.match(/^.{8,30}$/),
    },
    {
      label: t("passwordCriteria.uppercase"),
      valid: !!values.password.match(/[A-Z]/),
    },
    {
      label: t("passwordCriteria.lowercase"),
      valid: !!values.password.match(/[a-z]/),
    },
    {
      label: t("passwordCriteria.number"),
      valid: !!values.password.match(/\d/),
    },
    {
      label: t("passwordCriteria.special"),
      valid: !!values.password.match(/[^A-Za-z0-9]/),
    },
  ];

  /** Soumission du formulaire */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
      const parsed = ResetPasswordSchema.parse(values);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const translatedErrors: Record<string, string> = {};
          Object.entries(data.errors).forEach(([field, msgKey]) => {
            const cleanKey = String(msgKey).replace(/^auth\.reset\.form\./, "");
            translatedErrors[field] = t(cleanKey);
          });
          setFieldErrors(translatedErrors);
          focusFirstError(translatedErrors);
          return;
        }

        if (data.error) {
          const cleanKey = String(data.error).replace(
            /^auth\.reset\.form\./,
            ""
          );
          const msg = cleanKey.startsWith("common.")
            ? tCommon(cleanKey.replace(/^common\./, ""))
            : t(cleanKey);

          toast.error(msg, { position: "top-right", duration: 5000 });
          return;
        }

        toast.error(t("errors.serverError"), {
          position: "top-right",
          duration: 5000,
        });
        return;
      }

      toast.success(t("success"), { position: "top-right", duration: 5000 });
      router.push(`/${locale}/login`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errs: FieldErrors = {};
        err.issues.forEach((issue) => {
          const k = issue.path[0] as keyof ResetPasswordInput;
          const msgKey = String(issue.message);
          errs[k] = t(msgKey);
        });
        setFieldErrors(errs);
        focusFirstError(errs);
      } else {
        toast.error(t("errors.serverError"), {
          position: "top-right",
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 backdrop-blur-sm">
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            {t("fields.email.label")}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              ref={emailRef}
              id="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                ${
                  fieldErrors.email
                    ? "border-red-600"
                    : "border-gray-700 hover:border-gray-600"
                }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-2 text-sm text-red-300">{fieldErrors.email}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            {t("fields.password.label")}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              ref={passwordRef}
              id="password"
              type={showPassword.password ? "text" : "password"}
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`block w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${
                  fieldErrors.password
                    ? "border-red-600"
                    : "border-gray-700 hover:border-gray-600"
                }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((s) => ({ ...s, password: !s.password }))
              }
              className="absolute inset-y-0 right-0 p-3 flex items-center rounded-full focus:outline-none focus:ring-0 focus:border-2 focus:border-indigo-500 transition-colors hover:cursor-pointer"
              aria-label={
                showPassword.password
                  ? t("fields.password.hide")
                  : t("fields.password.show")
              }
            >
              {showPassword.password ? (
                <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>

          {fieldErrors.password && (
            <p className="mt-2 text-sm text-red-300">{fieldErrors.password}</p>
          )}

          {values.password && (
            <ul className="mt-3 text-sm text-gray-400 space-y-1">
              {passwordCriteria.map((c) => (
                <li
                  key={c.label}
                  className={c.valid ? "text-emerald-400" : "text-gray-500"}
                >
                  {c.valid ? "✔️" : "❌"} {c.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirmation mot de passe */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            {t("fields.confirmPassword.label")}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              ref={confirmRef}
              id="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              value={values.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`block w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${
                  fieldErrors.confirmPassword
                    ? "border-red-600"
                    : "border-gray-700 hover:border-gray-600"
                }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((s) => ({ ...s, confirm: !s.confirm }))
              }
              className="absolute inset-y-0 right-0 p-3 flex items-center rounded-full focus:outline-none focus:ring-0 focus:border-2 focus:border-indigo-500 transition-colors hover:cursor-pointer"
              aria-label={
                showPassword.confirm
                  ? t("fields.confirmPassword.hide")
                  : t("fields.confirmPassword.show")
              }
            >
              {showPassword.confirm ? (
                <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-2 text-sm text-red-300">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Bouton de soumission */}
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
              {t("loading")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </form>
    </div>
  );
}
