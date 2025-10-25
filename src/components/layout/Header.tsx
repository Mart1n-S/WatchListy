"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/lib/redux/slices/userSlice";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const toggleMenu = () => setIsOpen((v) => !v);

  // --- Locale détectée depuis le pathname ---
  const currentLocale = pathname.startsWith("/en") ? "en" : "fr";

  // --- Fonction pour générer les bons liens localisés ---
  const getLocalizedPath = (href: string) => {
    if (href === "/") return `/${currentLocale}`;
    return `/${currentLocale}${href}`;
  };

  // --- Vérifie si un lien est actif ---
  const isActive = (href: string) => {
    const localized = getLocalizedPath(href);
    return pathname === localized || pathname.startsWith(`${localized}/`);
  };

  // --- Éléments de navigation ---
  const navItems = [{ name: "Accueil", href: "/" }];
  if (session) navItems.push({ name: "Profil", href: "/profile" });

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-sm shadow-sm z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href={`/${currentLocale}`}
          className="flex items-center gap-2"
          aria-label="Aller à l’accueil WatchListy"
        >
          <Image
            src="/watchlisty-icon.svg"
            alt="Logo WatchListy"
            width={32}
            height={32}
            sizes="32px"
            className="h-8 w-8"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            WatchListy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={getLocalizedPath(item.href)}
                aria-current={active ? "page" : undefined}
                className={`relative transition-colors ${
                  active ? "text-blue-400" : "text-gray-200 hover:text-blue-400"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Auth + Lang Switcher (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <button
              onClick={async () => {
                await signOut({ callbackUrl: `/${currentLocale}` });
                dispatch(clearUser());
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20 hover:shadow-red-500/30 group relative overflow-hidden hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <span className="relative">Déconnexion</span>
            </button>
          ) : (
            <>
              <Link
                href={getLocalizedPath("/login")}
                className="px-4 py-2 text-gray-200 hover:text-blue-400 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href={getLocalizedPath("/register")}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                S’inscrire
              </Link>
            </>
          )}

          {/* Sélecteur de langue */}
          <LocaleSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Ouvrir le menu"
          >
            {isOpen ? (
              <HiX className="w-6 h-6 text-gray-200" />
            ) : (
              <HiMenu className="w-6 h-6 text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 h-dvh min-h-screen w-screen block bg-gray-900/60 z-[95]"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le menu"
            />

            <motion.aside
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="md:hidden fixed inset-y-0 right-0 w-full sm:w-3/4 max-w-sm h-dvh overflow-y-auto bg-gray-900 shadow-xl z-[100]"
            >
              <div className="p-6 min-h-full flex flex-col">
                {/* Header Mobile */}
                <div className="flex justify-between items-center mb-8">
                  <Link
                    href={`/${currentLocale}`}
                    className="flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image
                      src="/watchlisty-icon.svg"
                      alt="Logo WatchListy"
                      width={32}
                      height={32}
                      sizes="32px"
                      className="h-8 w-8"
                    />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                      WatchListy
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Fermer le menu"
                  >
                    <HiX className="w-6 h-6 text-gray-200" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={getLocalizedPath(item.href)}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`block px-4 py-2 rounded-lg transition-colors ${
                          active
                            ? "bg-blue-950/40 text-blue-300 border border-blue-800/60"
                            : "text-gray-200 hover:bg-gray-800"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Auth Mobile */}
                <div className="mt-8 pt-4 border-t border-gray-800">
                  {session ? (
                    <button
                      onClick={async () => {
                        await signOut({ callbackUrl: `/${currentLocale}` });
                        dispatch(clearUser());
                      }}
                      className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20 hover:shadow-red-500/30 group relative overflow-hidden hover:cursor-pointer"
                    >
                      <span className="relative">Déconnexion</span>
                    </button>
                  ) : (
                    <>
                      <Link
                        href={getLocalizedPath("/login")}
                        onClick={() => setIsOpen(false)}
                        className="block w-full px-4 py-2 text-center rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors mb-3"
                      >
                        Connexion
                      </Link>
                      <Link
                        href={getLocalizedPath("/register")}
                        onClick={() => setIsOpen(false)}
                        className="block w-full px-4 py-2 text-center rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600 transition-all"
                      >
                        S’inscrire
                      </Link>
                    </>
                  )}
                </div>

                {/* Lang Switcher Mobile */}
                <div className="mt-6 flex justify-center">
                  <LocaleSwitcher />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
