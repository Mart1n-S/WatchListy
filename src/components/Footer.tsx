import Link from "next/link";
import Image from "next/image";
import { FiGithub, FiTwitter, FiInstagram, FiFacebook, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-gray-900/50 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-10 mb-10">
          {/* Section Marque */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Image
                src="/watchlisty-icon.svg"
                alt="Logo WatchListy"
                width={32}
                height={32}
                className="h-8 w-8 mr-2"
                priority
              />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Watch
              </span>
              <span className="text-gray-50">Listy</span>
            </h3>
            <p className="text-gray-300 mb-4">
              L’application ultime pour gérer et découvrir vos films et séries préférés.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FiGithub size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FiTwitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FiInstagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FiFacebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FiMail size={20} />
              </Link>
            </div>
          </div>

          {/* Section Liens utiles */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-50">Liens utiles</h4>
            <ul className="space-y-2">
              {[
                { name: "Accueil", href: "/" },
                { name: "Fonctionnalités", href: "/#features" },
                { name: "À propos", href: "/about" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
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
            <h4 className="font-semibold mb-4 text-gray-50">Légal</h4>
            <ul className="space-y-2">
              {[
                { name: "Conditions d'utilisation", href: "/legal/terms" },
                { name: "Politique de confidentialité", href: "/legal/privacy" },
                { name: "Politique de cookies", href: "/legal/cookies" },
                { name: "Accessibilité", href: "/legal/accessibility" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
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
          <h4 className="font-semibold mb-2 text-gray-50">Newsletter</h4>
          <p className="text-gray-300 mb-4 max-w-md">
            Abonnez-vous pour recevoir les dernières nouveautés, conseils et offres spéciales.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-grow px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            />
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 text-white
                               hover:from-blue-700 hover:to-emerald-600 transition-all
                               focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900">
              S’abonner
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} <span className="font-semibold">WatchListy</span>. Tous droits réservés.</p>

          <p className="mt-2">
            Made with ❤️ by l’équipe WatchListy
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Ce produit utilise l’API TMDB, mais n’est ni approuvé ni certifié par TMDB. Données et images fournies par
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-sky-400 hover:underline"
            >
              The Movie Database (TMDB)
            </a>.
          </p>
        </div>

      </div>
    </footer>
  );
}
