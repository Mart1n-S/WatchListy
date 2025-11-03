"use client";

import { useState } from "react";
import { HiMail } from "react-icons/hi";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";
import { z } from "zod";

import { useFieldValidation } from "@/lib/utils/useFieldValidation";
import {
  ResendSchema as EmailSchema,
  type ResendInput as EmailInput,
} from "@/lib/validators/auth-email";

export default function ForgotPasswordForm() {
  const t = useTranslations("auth.reset.request");
  const tForm = useTranslations("auth.reset.form");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  /** État du formulaire */
  const [values, setValues] = useState<EmailInput>({ email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  /** Validation champ par champ (focusout + live) */
  const { handleChangeValidation } = useFieldValidation(
    EmailSchema,
    values,
    setErrors,
    tForm
  );

  /** Gestion du changement */
  const handleChange = <K extends keyof EmailInput>(
    field: K,
    value: EmailInput[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    handleChangeValidation(field, value);
  };

  /** Soumission du formulaire */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      EmailSchema.parse(values);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of err.issues) {
          const key = issue.path[0] as keyof EmailInput;
          fieldErrors[key as string] = tForm(issue.message);
        }
        setErrors(fieldErrors);
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t("neutral"), { position: "top-right", duration: 5000 });
        setValues({ email: "" });
        setErrors({});
      } else if (data.error) {
        const cleanKey = String(data.error).replace(/^auth\.reset\.form\./, "");
        toast.error(
          tForm(`errors.${cleanKey}`) || tCommon("errors.unexpected"),
          { position: "top-right", duration: 5000 }
        );
      } else {
        toast.error(tCommon("errors.unexpected"), {
          position: "top-right",
          duration: 5000,
        });
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
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border ${
                errors.email
                  ? "border-red-600"
                  : "border-gray-700 hover:border-gray-600"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-sm text-red-300">{errors.email}</p>
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
