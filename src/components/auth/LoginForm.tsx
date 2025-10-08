"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { HiEye, HiEyeOff, HiMail, HiLockClosed } from "react-icons/hi";
import { login } from "../../lib/apiClient"; // garde ton import actuel
import { LoginSchema, type LoginInput } from "../../lib/validators/auth";

type FieldErrors = Partial<Record<keyof LoginInput, string>>;

export default function LoginForm() {
  const [values, setValues] = useState<LoginInput>({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Erreurs
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  // refs utiles pour focus sur le 1er champ invalide
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    setFieldErrors((fe) => ({ ...fe, [name]: undefined })); // clear l'erreur du champ en édition
    setFormError(null);
  };

  const focusFirstError = (errs: FieldErrors) => {
    if (errs.email) emailRef.current?.focus();
    else if (errs.password) passwordRef.current?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    setFieldErrors({});

    // on trim avant la validation
    const toValidate: LoginInput = {
      email: values.email.trim(),
      password: values.password.trim(),
      remember: values.remember ?? false,
    };

    const parsed = LoginSchema.safeParse(toValidate);
    if (!parsed.success) {
      const errs: FieldErrors = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof LoginInput;
        errs[k] = i.message;
      });
      setFieldErrors(errs);
      focusFirstError(errs);
      setIsLoading(false);
      return;
    }

    try {
      await login(parsed.data);
    //   TODO: provisoire a ajuster quand l’auth sera en place
      window.location.href = "/dashboard"; // provisoire
    } catch (err: unknown) {
      const apiError = err as Partial<{
        message: string;
        fieldErrors: Record<string, string>;
      }>;

      if (apiError.fieldErrors) {
        setFieldErrors(apiError.fieldErrors);
      }

      setFormError(apiError.message ?? "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
            Adresse email
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
              placeholder="votre.email@exemple.com"
              className={`block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${fieldErrors.email ? "border-red-600" : "border-gray-700 hover:border-gray-600"}
              `}
            />
          </div>
          {fieldErrors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-300">{fieldErrors.email}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
            Mot de passe
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
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              placeholder="••••••••"
              className={`block w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${fieldErrors.password ? "border-red-600" : "border-gray-700 hover:border-gray-600"}
              `}
            />
            <button
              type="button"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
            <p id="password-error" className="mt-2 text-sm text-red-300">{fieldErrors.password}</p>
          )}
        </div>

        {/* Options */}
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={values.remember}
              onChange={onChange}
              className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-700 rounded bg-gray-800"
            />
            <span className="text-sm text-gray-300">Se souvenir de moi</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0A12 12 0 000 12h4z"/>
              </svg>
              Connexion en cours...
            </>
          ) : (
            "Se connecter"
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}
