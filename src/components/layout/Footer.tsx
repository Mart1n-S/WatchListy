"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  FiGithub,
  FiTwitter,
  FiInstagram,
  FiFacebook,
  FiMail,
} from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("layout.footer");
  const pathname = usePathname();

  // Locale courante
  const currentLocale = pathname.startsWith("/en") ? "en" : "fr";

  // Fonction pour générer les bons chemins localisés
  const getLocalizedPath = (href: string) => {
    if (href === "/") return `/${currentLocale}`;
    return `/${currentLocale}${href}`;
  };

  return (
    <footer className="w-full mt-auto bg-gray-900/50 border-t border-gray-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-10 mb-10">
          {/* Section Marque */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Image
                src="/watchlisty-icon.svg"
                alt={t("brand.logoAlt")}
                width={32}
                height={32}
                className="h-8 w-8 mr-2"
              />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Watch
              </span>
              <span className="text-gray-50">Listy</span>
            </h3>
            <p className="text-gray-300 mb-4">{t("brand.description")}</p>

            <div className="flex space-x-4">
              <Link
                href="#"
                aria-label="GitHub"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiGithub size={20} />
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiTwitter size={20} />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiInstagram size={20} />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiFacebook size={20} />
              </Link>
              <Link
                href="#"
                aria-label="Email"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiMail size={20} />
              </Link>
            </div>
          </div>

          {/* Section Liens utiles */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-50">
              {t("usefulLinks.title")}
            </h4>
            <ul className="space-y-2">
              {[
                { name: t("usefulLinks.home"), href: "/" },
                { name: t("usefulLinks.features"), href: "/#features" },
                { name: t("usefulLinks.about"), href: "/about" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={getLocalizedPath(item.href)}
                    className="text-gray-300 hover:text-blue-400 transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Légal */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-50">
              {t("legal.title")}
            </h4>
            <ul className="space-y-2">
              {[
                { name: t("legal.terms"), href: "/legal/terms" },
                { name: t("legal.privacy"), href: "/legal/privacy" },
                { name: t("legal.cookies"), href: "/legal/cookies" },
                {
                  name: t("legal.accessibility"),
                  href: "/legal/accessibility",
                },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={getLocalizedPath(item.href)}
                    className="text-gray-300 hover:text-blue-400 transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="font-semibold mb-2 text-gray-50">
            {t("newsletter.title")}
          </h4>
          <label htmlFor="newsletter" className="text-gray-300 mb-4 max-w-md">
            {t("newsletter.description")}
          </label>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              id="newsletter"
              placeholder={t("newsletter.placeholder")}
              className="flex-grow px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            />
            <button
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 text-white
                               hover:from-blue-700 hover:to-emerald-600 transition-all
                               focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {t("newsletter.button")}
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">WatchListy</span>.{" "}
            {t("copyright.rights")}
          </p>

          <p className="mt-2">{t("copyright.madeWith")}</p>

          <p className="mt-2 text-xs text-gray-400">
            {t("copyright.disclaimer")}{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-sky-400 hover:text-sky-500 underline"
            >
              The Movie Database (TMDB)
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
