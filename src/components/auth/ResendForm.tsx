"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { HiMail } from "react-icons/hi";
import toast from "react-hot-toast";
import { z } from "zod";

import { ResendSchema, type ResendInput } from "@/lib/validators/auth-email";
import { useFieldValidation } from "@/lib/utils/useFieldValidation";

export default function ResendForm() {
  const t = useTranslations("auth.verify");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  /** État du formulaire */
  const [values, setValues] = useState<ResendInput>({ email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /** Hook de validation champ-par-champ (focusout + live) */
  const { handleChangeValidation } = useFieldValidation(
    ResendSchema,
    values,
    setErrors,
    t
  );

  /** Gestion du changement d’un champ */
  const handleChange = <K extends keyof ResendInput>(
    field: K,
    value: ResendInput[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    handleChangeValidation(field, value);
  };

  /** Soumission du formulaire */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation complète avant envoi
    try {
      ResendSchema.parse(values);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of err.issues) {
          const key = issue.path[0] as keyof ResendInput;
          fieldErrors[key as string] = t(issue.message);
        }
        setErrors(fieldErrors);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const translatedErrors: Record<string, string> = {};
          Object.entries(data.errors).forEach(([field, msgKey]) => {
            const cleanKey = String(msgKey).replace(/^auth\.verify\./, "");
            translatedErrors[field] = t(cleanKey);
          });
          setErrors(translatedErrors);
          return;
        }

        if (data.error) {
          const cleanKey = String(data.error).replace(/^auth\.verify\./, "");
          const msg = cleanKey.startsWith("common.")
            ? tCommon(cleanKey.replace(/^common\./, ""))
            : t(cleanKey);

          toast.error(msg, { position: "top-right", duration: 5000 });
          return;
        }

        toast.error(t("errors.unexpected"), {
          position: "top-right",
          duration: 5000,
        });
        return;
      }

      // Succès
      if (data.message) {
        const cleanKey = String(data.message).replace(/^auth\.verify\./, "");
        toast.success(t(cleanKey), { duration: 6000, position: "top-right" });
      } else {
        toast.success(t("resend.neutral"), { duration: 6000 });
      }

      setValues({ email: "" });
      setErrors({});
    } catch (err) {
      console.error("Erreur lors du renvoi d’e-mail:", err);
      toast.error(t("errorText"), { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Champ Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm text-start font-medium text-gray-200 mb-2"
        >
          {t("resend.label")}
        </label>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiMail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
          </div>

          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            placeholder={t("resend.placeholder")}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border ${
              errors.email
                ? "border-red-600"
                : "border-gray-700 hover:border-gray-600"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          />
        </div>

        {errors.email && (
          <p className="text-red-400 text-start text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Bouton d’envoi */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60 hover:cursor-pointer transition-colors"
      >
        {loading ? t("resend.loading") : t("resend.button")}
      </button>
    </form>
  );
}
