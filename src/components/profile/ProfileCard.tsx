'use client';

import Image from 'next/image';
import { FiUser, FiCalendar, FiEdit3, FiFilm, FiTv } from 'react-icons/fi';
import { useAppSelector } from '@/lib/redux/hooks';
import { Genre } from '@/lib/redux/slices/genresSlice';

interface ProfileCardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    createdAt?: string | null;
    preferences?: {
      movies?: number[];
      tv?: number[];
    };
  };
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const genres = useAppSelector((state) => state.genres);

  const getGenreName = (id: number, type: 'movie' | 'tv') => {
    const list: Genre[] = type === 'movie' ? genres.movies : genres.tv;
    return list.find((g) => g.id === id)?.name || 'Inconnu';
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700/50 rounded-3xl p-8 w-full shadow-2xl shadow-slate-900/30 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* === SECTION GAUCHE : AVATAR + INFOS === */}
          <div className="flex flex-col sm:flex-row items-center gap-6 flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-md opacity-60 animate-pulse"></div>
              <Image
                src={`/images/avatars/${user.image || 'default.png'}`}
                alt="Avatar"
                width={80}
                height={80}
                className="relative w-20 h-20 rounded-full object-cover border-2 border-slate-600/50 shadow-lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-white font-bold text-2xl truncate">
                {user.name || 'Utilisateur'}
              </h1>
              <p className="text-slate-300 text-lg truncate mt-2">{user.email}</p>

              {/* === INFOS SECONDAIRES === */}
              <div className="flex flex-wrap items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <FiUser className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm">{user.role || 'Utilisateur'}</span>
                </div>

                {user.createdAt && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <FiCalendar className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">
                      Membre depuis{" "}
                      {typeof window !== "undefined"
                        ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                )}

              </div>

              {/* === PRÉFÉRENCES === */}
              {(user.preferences?.movies?.length || user.preferences?.tv?.length) && (
                <div className="mt-6 space-y-4">
                  {user.preferences?.movies?.length ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FiFilm className="text-indigo-400 w-5 h-5" />
                        <h2 className="text-indigo-300 font-semibold">
                          Genres de films favoris
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.movies.map((id) => (
                          <span
                            key={id}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-600/50 transition-colors"
                          >
                            {getGenreName(id, 'movie')}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {user.preferences?.tv?.length ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FiTv className="text-purple-400 w-5 h-5" />
                        <h2 className="text-purple-300 font-semibold">
                          Genres de séries favoris
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences.tv.map((id) => (
                          <span
                            key={id}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:bg-purple-600/50 transition-colors"
                          >
                            {getGenreName(id, 'tv')}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* === SECTION DROITE : ACTION === */}
          <div className="flex-shrink-0">
            <button
              type="button"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 group relative overflow-hidden flex items-center gap-3"
              onClick={() => alert('Fonctionnalité de modification à venir')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FiEdit3 className="w-5 h-5 relative" />
              <span className="relative">Modifier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
