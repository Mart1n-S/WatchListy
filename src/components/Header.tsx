"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Fonction pour déterminer si un lien est actif
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-sm py-4 px-6 flex justify-between items-center z-50">
        <Link href="/" className="text-2xl font-bold dark:text-gray-200">
          WatchListy
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-gray-700 dark:text-gray-200">
          <Link 
            href="/" 
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors pb-1 ${
              isActiveLink("/") 
                ? "border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400" 
                : ""
            }`}
          >
            Accueil
          </Link>
          <Link 
            href="/about" 
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors pb-1 ${
              isActiveLink("/about") 
                ? "border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400" 
                : ""
            }`}
          >
            À propos
          </Link>
          <Link 
            href="/login" 
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors pb-1 ${
              isActiveLink("/login") 
                ? "border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400" 
                : ""
            }`}
          >
            Se connecter
          </Link>
        </nav>

        {/* Burger menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none z-50 relative"
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile nav slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-40 md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-20 px-6">
          <nav className="flex flex-col gap-6">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className={`text-lg transition-colors py-2 border-b border-gray-200 dark:border-gray-700 ${
                isActiveLink("/")
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Accueil
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsOpen(false)}
              className={`text-lg transition-colors py-2 border-b border-gray-200 dark:border-gray-700 ${
                isActiveLink("/about")
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              À propos
            </Link>
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className={`text-lg transition-colors py-2 border-b border-gray-200 dark:border-gray-700 ${
                isActiveLink("/login")
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Se connecter
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
