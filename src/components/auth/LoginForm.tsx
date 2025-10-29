"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { HiEye, HiEyeOff, HiMail, HiLockClosed } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { LoginSchema, type LoginInput } from "@/lib/validators/auth";

/**
 * Type pour les erreurs de champ de formulaire
 * Permet d'associer chaque champ (email, password) à un message d'erreur
 */
type FieldErrors = Partial<Record<keyof LoginInput, string>>;

/**
 * Composant LoginForm - Formulaire de connexion utilisateur
 *
 * Ce composant gère l'authentification des utilisateurs via NextAuth.js
 * avec validation des champs, gestion d'erreurs et expérience utilisateur optimisée
 *
 */
export default function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const pathname = usePathname();

  // Détecte la locale actuelle
  const currentLocale = pathname.startsWith("/en") ? "en" : "fr";

  /**
   * État des valeurs du formulaire
   * Contient les données saisies par l'utilisateur
   */
  const [values, setValues] = useState<LoginInput>({
    email: "",
    password: "",
  });

  /**
   * État pour afficher/masquer le mot de passe
   * Améliore l'UX en permettant à l'utilisateur de vérifier sa saisie
   */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * État de chargement pendant la soumission du formulaire
   * Utilisé pour désactiver le bouton et afficher un indicateur de progression
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * État des erreurs de validation par champ
   * Stocke les messages d'erreur spécifiques à chaque input
   */
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  /**
   * État des erreurs générales du formulaire
   * Utilisé pour les erreurs d'authentification (mauvais identifiants, etc.)
   */
  const [formError, setFormError] = useState<string | null>(null);

  /**
   * Références pour les champs de formulaire
   * Permet de focus automatiquement sur le premier champ en erreur
   */
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  /**
   * Gestionnaire de changement pour les inputs du formulaire
   * Met à jour les valeurs et efface les erreurs associées au champ modifié
   *
   * @param e - Événement de changement d'input
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setFieldErrors((fe) => ({ ...fe, [name]: undefined }));
    setFormError(null);
  };

  /**
   * Focus sur le premier champ contenant une erreur
   * Améliore l'accessibilité et l'expérience utilisateur
   *
   * @param errs - Objet contenant les erreurs de champ
   */
  const focusFirstError = (errs: FieldErrors) => {
    if (errs.email) emailRef.current?.focus();
    else if (errs.password) passwordRef.current?.focus();
  };

  /**
   * Gestionnaire de soumission du formulaire
   * Valide les données, tente l'authentification et gère les erreurs
   *
   * @param e - Événement de soumission du formulaire
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Réinitialisation des états
    setIsLoading(true);
    setFormError(null);
    setFieldErrors({});

    /**
     * Nettoyage des données : suppression des espaces superflus
     * Important pour éviter les erreurs de validation dues aux espaces
     */
    const toValidate: LoginInput = {
      email: values.email.trim(),
      password: values.password.trim(),
    };

    /**
     * Validation des données avec Zod
     * Vérifie que les champs requis sont remplis et valides
     */
    const parsed = LoginSchema.safeParse(toValidate);
    if (!parsed.success) {
      // Transformation des erreurs Zod en format utilisable par l'UI
      const errs: FieldErrors = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof LoginInput;
        errs[k] = t(i.message.replace(/^auth\.login\./, ""));
      });
      setFieldErrors(errs);
      focusFirstError(errs);
      setIsLoading(false);
      return;
    }

    /**
     * Tentative d'authentification avec NextAuth
     */
    try {
      const result = await signIn("credentials", {
        email: toValidate.email,
        password: toValidate.password,
        redirect: false,
      });

      /**
       * Gestion des erreurs d'authentification
       * NextAuth retourne une erreur générique pour la sécurité
       */
      if (result?.error) {
        setFormError(t(result.error.replace(/^auth\.login\./, "")));
        return;
      }

      if (result?.ok) {
        // Redirection vers la page protégée
        router.push(`/${currentLocale}/profile`);
        // Recharge les données de session côté serveur
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setFormError(t("errors.unexpected"));
    } finally {
      /**
       * Réinitialisation de l'état de chargement dans tous les cas
       * Garantit que le bouton est réactivé même en cas d'erreur
       */
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 backdrop-blur-sm">
      {/* Erreur formulaire (globale) */}
      {formError && (
        <div
          className="mb-6 rounded-lg border border-red-700 bg-red-900/40 text-red-200 px-4 py-3"
          role="alert"
        >
          {formError}
        </div>
      )}

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
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={onChange}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
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
            <p id="email-error" className="mt-2 text-sm text-red-300">
              {fieldErrors.email}
            </p>
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
              name="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={onChange}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className={`block w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                ${
                  fieldErrors.password
                    ? "border-red-600"
                    : "border-gray-700 hover:border-gray-600"
                }
              `}
            />
            <button
              type="button"
              aria-label={
                showPassword
                  ? t("fields.password.hide")
                  : t("fields.password.show")
              }
              className="absolute inset-y-0 right-0 p-3 flex items-center rounded-full focus:outline-none focus:ring-0 focus:border-2 focus:border-indigo-500 transition-colors hover:cursor-pointer"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" className="mt-2 text-sm text-red-300">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="flex items-center justify-end">
          <Link
            href={`/${currentLocale}/forgot-password`}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {t("forgot")}
          </Link>
        </div>

        {/* Bouton */}
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
          {t("noAccount")}{" "}
          <Link
            href={`/${currentLocale}/register`}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            {t("createAccount")}
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-gray-400">
          {t("notVerified")}{" "}
          <Link
            href={`/${currentLocale}/resend-verification`}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            {t("resendVerification")}
          </Link>
        </p>
      </form>
    </div>
  );
}
