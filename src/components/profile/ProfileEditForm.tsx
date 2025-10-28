"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setUser } from "@/lib/redux/slices/userSlice";
import { updateUserSchema, type UpdateUserInput } from "@/lib/validators/user";
import toast from "react-hot-toast";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { HiEye, HiEyeOff, HiLockClosed } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

/**
 * Formulaire complet d’édition du profil utilisateur
 * - Avatars radio-cards accessibles
 * - Validation dynamique du mot de passe
 * - Labels reliés via htmlFor/id
 */
export default function ProfileEditForm({ user }: { user: Session["user"] }) {
  const t = useTranslations("ProfileEdit");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const genres = useAppSelector((state) => state.genres);
  const { data: session, update } = useSession();
  const locale = useLocale();

  /** État local du formulaire */
  const [form, setForm] = useState<UpdateUserInput>({
    pseudo: user.name ?? "",
    avatar: user.image ?? "avatar1.svg",
    preferences: user.preferences ?? { movies: [], tv: [] },
    oldPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = <K extends keyof UpdateUserInput>(
    field: K,
    value: UpdateUserInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Si on efface un champ de mot de passe → on supprime juste l’erreur sans valider
    const passwordFields = ["oldPassword", "newPassword", "confirmPassword"];
    if (passwordFields.includes(field as string)) {
      if (!value || value === "") {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[field as string];
          return updated;
        });
        return;
      }
    }

    // Validation instantanée d’un champ "non-mot de passe"
    const singleFieldSchema = updateUserSchema.pick({ [field]: true });
    const result = singleFieldSchema.safeParse({ [field]: value });

    setErrors((prev) => {
      const updated = { ...prev };
      if (result.success) delete updated[field as string];
      return updated;
    });
  };

  /** Vérifie les critères de sécurité du mot de passe */
  const passwordCriteria = [
    {
      label: t("passwordCriteria.length"),
      valid: !!form.newPassword?.match(/^.{8,30}$/),
    },
    {
      label: t("passwordCriteria.uppercase"),
      valid: !!form.newPassword?.match(/[A-Z]/),
    },
    {
      label: t("passwordCriteria.lowercase"),
      valid: !!form.newPassword?.match(/[a-z]/),
    },
    {
      label: t("passwordCriteria.number"),
      valid: !!form.newPassword?.match(/\d/),
    },
    {
      label: t("passwordCriteria.special"),
      valid: !!form.newPassword?.match(/[!@#$%^&*(),.?\":{}|<>]/),
    },
  ];

  /** Soumission du formulaire */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const parsed = updateUserSchema.parse(form);
      const res = await fetch("/api/user/update", {
        method: "PATCH",
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
          Object.entries(data.errors).forEach(([field, messageKey]) => {
            // Supprime le préfixe "ProfileEdit." si présent
            const cleanKey = String(messageKey).replace(/^ProfileEdit\./, "");
            translatedErrors[field] = t(cleanKey);
          });
          setErrors(translatedErrors);
        }

        // Idem pour l’erreur globale
        const globalErrorKey = String(
          data.error || "ProfileEdit.errors.updateFailed"
        ).replace(/^ProfileEdit\./, "");
        throw new Error(t(globalErrorKey));
      }

      dispatch(setUser(data.user));
      await update({
        ...session,
        user: { ...session?.user, ...data.user },
        trigger: "update",
      });

      toast.success(t("success"), { position: "top-right", duration: 5000 });

      router.push(`/${locale}/profile`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          const msgKey = String(issue.message);
          fieldErrors[key] = t(msgKey);
        });
        setErrors(fieldErrors);
      } else {
        toast.error(t("error"), { position: "top-right", duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  /** Liste des avatars disponibles */
  const avatars = Array.from({ length: 6 }, (_, i) => `avatar${i + 1}.svg`);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900/60 border border-gray-800 rounded-3xl p-4 backdrop-blur-sm shadow-xl space-y-8"
    >
      {/* === AVATARS === */}
      <div>
        <fieldset>
          <legend className="block text-gray-200 mb-3 font-medium text-lg">
            {t("chooseAvatar")}
          </legend>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
            {avatars.map((a, i) => {
              const id = `avatar-${i}`;
              const isSelected = form.avatar === a;
              return (
                <label
                  key={a}
                  htmlFor={id}
                  className={`relative rounded-2xl p-2 flex flex-col items-center transition-all cursor-pointer border-2
                    ${
                      isSelected
                        ? "border-indigo-500 bg-gray-800/70 ring-2 ring-indigo-600"
                        : "border-gray-700 hover:border-indigo-400/50 hover:bg-gray-800/40"
                    }
                    focus-within:ring-2 focus-within:ring-indigo-400 focus-within:ring-offset-2 focus-within:ring-offset-gray-900
                  `}
                >
                  <input
                    type="radio"
                    id={id}
                    name="avatar"
                    value={a}
                    checked={isSelected}
                    onChange={() => handleChange("avatar", a)}
                    className="absolute opacity-0 pointer-events-none"
                  />
                  <Image
                    src={`/images/avatars/${a}`}
                    alt={`${t("avatar")} ${i + 1}`}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 ring-2 ring-indigo-500 pointer-events-none" />
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
        {errors.avatar && (
          <p className="text-red-400 text-sm mt-2">{errors.avatar}</p>
        )}
      </div>

      {/* === PSEUDO === */}
      <div>
        <label
          htmlFor="pseudo"
          className="block text-gray-200 mb-2 font-medium"
        >
          {t("pseudo")}
        </label>
        <input
          id="pseudo"
          type="text"
          value={form.pseudo ?? ""}
          onChange={(e) => handleChange("pseudo", e.target.value)}
          className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none transition-colors ${
            errors.pseudo
              ? "border-red-600"
              : "border-gray-700 hover:border-gray-600"
          }`}
        />
        {errors.pseudo && (
          <p className="text-red-400 text-sm mt-1">{errors.pseudo}</p>
        )}
      </div>

      {/* === PREFERENCES - FILMS === */}
      <div>
        <fieldset>
          <legend className="block text-gray-200 mb-2 font-medium">
            {t("moviePreferences")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {genres.movies.map((g) => {
              const id = `movie-${g.id}`;
              const selected = form.preferences?.movies ?? [];
              const isActive = selected.includes(g.id);
              return (
                <label
                  key={g.id}
                  htmlFor={id}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  } focus-within:ring-2 focus-within:ring-indigo-400 focus-within:ring-offset-2 focus-within:ring-offset-gray-900`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={isActive}
                    onChange={() =>
                      handleChange("preferences", {
                        ...form.preferences,
                        movies: isActive
                          ? selected.filter((id) => id !== g.id)
                          : [...selected, g.id],
                      })
                    }
                    className="sr-only"
                  />
                  {g.name}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* === PREFERENCES - SERIES === */}
      <div>
        <fieldset>
          <legend className="block text-gray-200 mb-2 font-medium">
            {t("tvPreferences")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {genres.tv.map((g) => {
              const id = `tv-${g.id}`;
              const selected = form.preferences?.tv ?? [];
              const isActive = selected.includes(g.id);
              return (
                <label
                  key={g.id}
                  htmlFor={id}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  } focus-within:ring-2 focus-within:ring-emerald-400 focus-within:ring-offset-2 focus-within:ring-offset-gray-900`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={isActive}
                    onChange={() =>
                      handleChange("preferences", {
                        ...form.preferences,
                        tv: isActive
                          ? selected.filter((id) => id !== g.id)
                          : [...selected, g.id],
                      })
                    }
                    className="sr-only"
                  />
                  {g.name}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* === MOT DE PASSE === */}
      <div className="flex flex-col gap-6">
        {/* Ancien mot de passe */}
        <div className="relative group">
          <label
            htmlFor="oldPassword"
            className="block text-gray-200 mb-2 font-medium"
          >
            {t("oldPassword")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              id="oldPassword"
              type={showPassword.old ? "text" : "password"}
              onChange={(e) => handleChange("oldPassword", e.target.value)}
              className={`w-full pl-10 pr-12 bg-gray-800 border rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none transition-colors ${
                errors.oldPassword
                  ? "border-red-600"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
            <button
              type="button"
              aria-label={
                showPassword.old ? t("hideOldPassword") : t("showOldPassword")
              }
              className="absolute inset-y-0 right-0 p-3 flex items-center rounded-full focus:outline-none focus:ring-0 focus:border-2 focus:border-indigo-500 transition-colors hover:cursor-pointer"
              onClick={() => setShowPassword((s) => ({ ...s, old: !s.old }))}
            >
              {showPassword.old ? (
                <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-400 text-sm mt-1">{errors.oldPassword}</p>
          )}
        </div>

        {/* Nouveau mot de passe */}
        <div className="relative group">
          <label
            htmlFor="newPassword"
            className="block text-gray-200 mb-2 font-medium"
          >
            {t("newPassword")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              id="newPassword"
              type={showPassword.new ? "text" : "password"}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              className={`w-full pl-10 pr-12 bg-gray-800 border rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none transition-colors ${
                errors.newPassword
                  ? "border-red-600"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
            <button
              type="button"
              aria-label={
                showPassword.new ? t("hideNewPassword") : t("showNewPassword")
              }
              className="absolute inset-y-0 right-0 p-3 flex items-center rounded-full focus:outline-none focus:ring-0 focus:border-2 focus:border-indigo-500 transition-colors hover:cursor-pointer"
              onClick={() => setShowPassword((s) => ({ ...s, new: !s.new }))}
            >
              {showPassword.new ? (
                <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>

          {form.newPassword && (
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

        {/* Confirmation */}
        <div className="relative group">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-200 mb-2 font-medium"
          >
            {t("confirmPassword")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              id="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`w-full pl-10 pr-12 bg-gray-800 border rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none transition-colors ${
                errors.confirmPassword
                  ? "border-red-600"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
            <button
              type="button"
              aria-label={
                showPassword.confirm
                  ? t("hideConfirmPassword")
                  : t("showConfirmPassword")
              }
              className="absolute inset-y-0 right-0 p-3 flex items-center rounded-full focus:outline-none focus:ring-0 focus:border-2 focus:border-indigo-500 transition-colors hover:cursor-pointer"
              onClick={() =>
                setShowPassword((s) => ({ ...s, confirm: !s.confirm }))
              }
            >
              {showPassword.confirm ? (
                <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {/* === BOUTONS === */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium transition hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {t("cancel")}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-60 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {loading ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
