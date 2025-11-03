"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import SearchBar from "@/components/ui/SearchBar";

interface PublicUser {
  _id: string;
  pseudo: string;
  avatar?: string | null;
  created_at?: string;
  likesCount: number;
}

export default function UsersList() {
  const t = useTranslations("users");
  const locale = useLocale();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  /** Liste filtrée en fonction de la recherche */
  const filteredUsers = users.filter((u) =>
    u.pseudo.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/users");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erreur serveur");
        }

        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Erreur chargement utilisateurs :", err);
        setError(t("errors.fetchFailed"));
        toast.error(t("errors.fetchFailed"));
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [t]);

  // --- États de chargement / erreur ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mb-3" />
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 py-12">{error}</p>;
  }

  if (users.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        {t("empty", { defaultValue: "Aucun utilisateur trouvé." })}
      </p>
    );
  }

  return (
    <section className="bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Barre de recherche */}
      <div className="px-4 pt-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t("searchPlaceholder", {
            defaultValue: "Rechercher un utilisateur...",
          })}
          accentColor="indigo"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800/60 px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">{t("titleColumn")}</h2>
        <span className="text-sm text-gray-400">
          {t("count", {
            count: filteredUsers.length,
            defaultValue: `${filteredUsers.length} utilisateurs`,
          })}
        </span>
      </div>

      {/* Liste */}
      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          {t("noResults", {
            defaultValue: "Aucun utilisateur ne correspond à votre recherche.",
          })}
        </p>
      ) : (
        <ul className="divide-y divide-gray-800">
          {filteredUsers.map((user, index) => (
            <motion.li
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                href={`/${locale}/users/${user.pseudo}`}
                className="
                  flex items-center justify-between px-6 py-4 
                  hover:bg-gray-800/50 focus:bg-gray-800/60 
                  outline-none transition-all group
                  focus-visible:ring-2 focus-visible:ring-indigo-500 
                  focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 
                  rounded-md
                "
              >
                {/* --- Bloc gauche : Rang + Avatar + Nom --- */}
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    #{index + 1}
                  </div>

                  <Image
                    src={`/images/avatars/${user.avatar || "default.png"}`}
                    alt={user.pseudo}
                    width={50}
                    height={50}
                    className="rounded-full border border-gray-700 group-hover:border-indigo-500 transition-all object-cover"
                  />

                  <div>
                    <p className="text-gray-100 font-medium group-hover:text-indigo-400 transition-colors">
                      {user.pseudo}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(user.created_at ?? "").toLocaleDateString(
                        locale,
                        {
                          year: "numeric",
                          month: "short",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* --- Bloc droit : Likes --- */}
                <div className="flex items-center gap-2 text-rose-400 font-semibold">
                  <FiHeart className="w-4 h-4" />
                  <span>{user.likesCount}</span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
