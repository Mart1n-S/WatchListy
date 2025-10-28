"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchGenres } from "@/lib/redux/thunks/fetchGenres";
import { useEffect } from "react";
import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { z } from "zod";
import { RegisterSchema, type RegisterInput } from "@/lib/validators/register";

/** Gestion des erreurs par champ */
type FieldErrors = Partial<Record<keyof RegisterInput, string>>;

export default function RegisterForm() {
  const t = useTranslations("auth.register");
  const tCommon = useTranslations("common");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "fr";

  useEffect(() => {
    dispatch(fetchGenres(locale));
  }, [locale, dispatch]);

  /** Récupération des genres depuis Redux */
  const genres = useAppSelector((state) => state.genres);

  /** État du formulaire */
  const [values, setValues] = useState<RegisterInput>({
    email: "",
    pseudo: "",
    password: "",
    confirmPassword: "",
    avatar: "avatar1.svg",
    preferences: { movies: [], tv: [] },
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const pseudoRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  const focusFirstError = (errs: FieldErrors) => {
    if (errs.email) emailRef.current?.focus();
    else if (errs.pseudo) pseudoRef.current?.focus();
    else if (errs.password) passwordRef.current?.focus();
    else if (errs.confirmPassword) confirmRef.current?.focus();
  };

  /** Gestion d’un changement de champ générique */
  const handleChange = <K extends keyof RegisterInput>(
    field: K,
    value: RegisterInput[K]
  ) => {
    setValues((v) => ({ ...v, [field]: value }));
    setFieldErrors((f) => ({ ...f, [field]: undefined }));
  };

  /** Vérifie les critères de sécurité du mot de passe */
  const passwordCriteria = [
    {
      label: t("passwordCriteria.length"),
      valid: !!values.password?.match(/^.{8,30}$/),
    },
    {
      label: t("passwordCriteria.uppercase"),
      valid: !!values.password?.match(/[A-Z]/),
    },
    {
      label: t("passwordCriteria.lowercase"),
      valid: !!values.password?.match(/[a-z]/),
    },
    {
      label: t("passwordCriteria.number"),
      valid: !!values.password?.match(/\d/),
    },
    {
      label: t("passwordCriteria.special"),
      valid: !!values.password?.match(/[!@#$%^&*(),.?\":{}|<>]/),
    },
  ];

  /** Soumission du formulaire */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
      const parsed = RegisterSchema.parse(values);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      // --- Gestion des erreurs backend ---
      if (!res.ok) {
        if (data.errors) {
          const translatedErrors: Record<string, string> = {};
          Object.entries(data.errors).forEach(([field, msgKey]) => {
            const cleanKey = String(msgKey).replace(/^auth\.register\./, "");
            translatedErrors[field] = t(cleanKey);
          });
          setFieldErrors(translatedErrors);
          focusFirstError(translatedErrors);
          return;
        }

        if (data.error) {
          const cleanKey = String(data.error).replace(/^auth\.register\./, "");
          const msg = cleanKey.startsWith("common.")
            ? tCommon(cleanKey.replace(/^common\./, ""))
            : t(cleanKey);

          if (cleanKey.includes("pseudoExists")) {
            setFieldErrors({ pseudo: msg });
            focusFirstError({ pseudo: msg });
            return;
          } else if (cleanKey.includes("emailExists")) {
            setFieldErrors({ email: msg });
            focusFirstError({ email: msg });
            return;
          }

          toast.error(msg, { position: "top-right", duration: 5000 });
          return;
        }

        toast.error(t("errors.unexpected"), {
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
          const k = issue.path[0] as keyof RegisterInput;
          const msgKey = String(issue.message);
          errs[k] = t(msgKey);
        });
        setFieldErrors(errs);
        focusFirstError(errs);
      } else if (err instanceof Error) {
        toast.error(err.message, { position: "top-right", duration: 5000 });
      } else {
        toast.error(t("errors.unexpected"), {
          position: "top-right",
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** Liste d’avatars disponibles */
  const avatars = Array.from({ length: 6 }, (_, i) => `avatar${i + 1}.svg`);

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl p-4 backdrop-blur-sm">
      <form className="space-y-6" onSubmit={onSubmit} noValidate>
        {/* === Sélection de l'avatar === */}
        <fieldset>
          <legend className="block text-gray-200 mb-3 font-medium text-lg">
            {t("fields.avatar.label")}
          </legend>
          <div className="grid grid-cols-3 lg:grid-cols-3 gap-6">
            {avatars.map((a, i) => {
              const id = `avatar-${i}`;
              const isSelected = values.avatar === a;
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
                    alt={`${t("fields.avatar.alt")} ${i + 1}`}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                </label>
              );
            })}
          </div>
          {fieldErrors.avatar && (
            <p className="text-red-400 text-sm mt-2">{fieldErrors.avatar}</p>
          )}
        </fieldset>

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
              name="email"
              type="email"
              value={values.email}
              autoComplete="email"
              onChange={(e) => handleChange("email", e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                ${
                  fieldErrors.email
                    ? "border-red-600"
                    : "border-gray-700 hover:border-gray-600"
                }
              `}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-2 text-sm text-red-300">{fieldErrors.email}</p>
          )}
        </div>

        {/* Pseudo */}
        <div>
          <label
            htmlFor="pseudo"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            {t("fields.pseudo.label")}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiUser className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              ref={pseudoRef}
              id="pseudo"
              name="pseudo"
              type="text"
              value={values.pseudo}
              onChange={(e) => handleChange("pseudo", e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
              ${
                fieldErrors.pseudo
                  ? "border-red-600"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            />
          </div>
          {fieldErrors.pseudo && (
            <p className="mt-2 text-sm text-red-300">{fieldErrors.pseudo}</p>
          )}
        </div>

        {/* === Préférences - Films === */}
        <fieldset>
          <legend className="block text-gray-200 mb-2 font-medium">
            {t("fields.preferences.movies")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {genres.movies.map((g) => {
              const id = `movie-${g.id}`;
              const selected = values.preferences.movies;
              const isActive = selected.includes(g.id);
              return (
                <label
                  key={g.id}
                  htmlFor={id}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-indigo-600"
                  } focus-within:ring-2 focus-within:ring-indigo-400 focus-within:ring-offset-2 focus-within:ring-offset-gray-900`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={isActive}
                    onChange={() =>
                      handleChange("preferences", {
                        ...values.preferences,
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

        {/* === Préférences - Séries === */}
        <fieldset>
          <legend className="block text-gray-200 mb-2 font-medium">
            {t("fields.preferences.tv")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {genres.tv.map((g) => {
              const id = `tv-${g.id}`;
              const selected = values.preferences.tv;
              const isActive = selected.includes(g.id);
              return (
                <label
                  key={g.id}
                  htmlFor={id}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-200 hover:bg-emerald-600"
                  } focus-within:ring-2 focus-within:ring-emerald-400 focus-within:ring-offset-2 focus-within:ring-offset-gray-900`}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={isActive}
                    onChange={() =>
                      handleChange("preferences", {
                        ...values.preferences,
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
              name="password"
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
              name="confirmPassword"
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

        {/* Footer */}
        <p className="text-center text-sm text-gray-400">
          {t("alreadyAccount")}{" "}
          <Link
            href={`/${locale}/login`}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            {t("goToLogin")}
          </Link>
        </p>
      </form>
    </div>
  );
}
