"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Détection de la locale actuelle
  const currentLocale = pathname.startsWith("/en") ? "en" : "fr";

  // Liste des langues disponibles
  const locales = [
    { code: "fr", label: "Français", flag: "/images/flags/france.svg" },
    { code: "en", label: "English", flag: "/images/flags/uk.svg" },
  ];

  const active = locales.find((l) => l.code === currentLocale)!;

  // Génère le chemin localisé en préservant les query params (token, etc.)
  const getLocalizedPath = useCallback(
    (locale: string) => {
      const cleanPath = pathname.replace(/^\/(fr|en)/, ""); // retire la locale actuelle
      const queryString = searchParams.toString(); // récupère ?token=xxxx
      return `/${locale}${cleanPath}${queryString ? `?${queryString}` : ""}`;
    },
    [pathname, searchParams]
  );

  // Ferme le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gère le clavier sur le bouton
  const handleKeyDownButton = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(0);
    }
  };

  // Gère le clavier dans la liste
  const handleKeyDownList = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null ? 0 : (prev + 1) % locales.length
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === null
          ? locales.length - 1
          : (prev - 1 + locales.length) % locales.length
      );
    } else if (e.key === "Enter" && focusedIndex !== null) {
      e.preventDefault();
      const target = locales[focusedIndex];
      window.location.href = getLocalizedPath(target.code);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* --- Bouton principal --- */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDownButton}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 hover:bg-gray-700 rounded-lg text-gray-100 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 transition-all hover:cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Changer la langue"
      >
        <Image
          src={active.flag}
          alt={active.label}
          width={20}
          height={14}
          style={{ height: "auto", width: "auto" }}
          className="rounded-sm shadow-sm"
        />
        <span>{active.code.toUpperCase()}</span>
        <HiChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* --- Menu déroulant --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            onKeyDown={handleKeyDownList}
            className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden backdrop-blur-md focus:outline-none"
          >
            {locales.map((locale, index) => (
              <li key={locale.code}>
                <Link
                  href={getLocalizedPath(locale.code)}
                  onClick={() => setIsOpen(false)}
                  role="option"
                  aria-selected={currentLocale === locale.code}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    currentLocale === locale.code
                      ? "bg-blue-600 text-white"
                      : focusedIndex === index
                      ? "bg-blue-400 text-white"
                      : "text-gray-200 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Image
                    src={locale.flag}
                    alt={locale.label}
                    width={20}
                    height={14}
                    style={{ height: "auto", width: "auto" }}
                    className="rounded-sm shadow-sm"
                  />
                  <span>{locale.label}</span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
