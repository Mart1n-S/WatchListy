"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { FiFilm } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen((v) => !v);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Découvrir", href: "/discover" },
    { name: "Communauté", href: "/community" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-sm shadow-sm z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Aller à l’accueil WatchListy"
          >
            <Image
              src="/watchlisty-icon.svg"
              alt=""        
              width={32}
              height={32}
              priority
              sizes="32px"
              className="h-8 w-8"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              WatchListy
            </span>
          </Link>

          {/* Desktop Navigation (dark only) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative transition-colors
                    ${active ? "text-blue-400" : "text-gray-200 hover:text-blue-400"}
                  `}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all
                      ${active ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-200 hover:text-blue-400 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all"
            >
              S’inscrire
            </Link>
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
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay pleine hauteur */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 h-dvh min-h-screen w-screen block bg-gray-900/60 backdrop-blur-sm z-[95]"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le menu"
            />

            {/* Drawer */}
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
                <div className="flex justify-between items-center mb-8">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 flex items-center justify-center">
                      <FiFilm className="text-white" />
                    </div>
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

                {/* Mobile nav avec indicateur actif (dark only) */}
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`block px-4 py-2 rounded-lg transition-colors
                          ${active
                            ? "bg-blue-950/40 text-blue-300 border border-blue-800/60"
                            : "text-gray-200 hover:bg-gray-800"}
                        `}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-4 border-t border-gray-800">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-2 text-center rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors mb-3"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-2 text-center rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600 transition-all"
                  >
                    S’inscrire
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
