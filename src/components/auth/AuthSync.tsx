"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser, clearUser } from "@/lib/redux/slices/userSlice";
import { fetchGenres } from "@/lib/redux/thunks/fetchGenres";
import { fetchUserMovies } from "@/lib/redux/thunks/userMoviesThunks";
import { clearUserMovies } from "@/lib/redux/slices/userMoviesSlice";
import { clearTmdbCache } from "@/lib/redux/slices/tmdbSlice"; // ✅ nouveau
import { useLocale } from "next-intl";

export default function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const locale = useLocale();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Hydrate Redux avec les infos NextAuth
      dispatch(
        setUser({
          id: session.user.id ?? null,
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
          role: session.user.role ?? "user",
          createdAt: session.user.createdAt ?? null,
          isAuthenticated: true,
          preferences: session.user.preferences ?? { movies: [], tv: [] },
        })
      );

      // Charge les genres TMDB
      dispatch(fetchGenres(locale));

      // Charge la watchlist utilisateur
      dispatch(fetchUserMovies());
    } else if (status === "unauthenticated") {
      // Purge le store complet
      dispatch(clearUser());
      dispatch(clearUserMovies());
      dispatch(clearTmdbCache());
    }
  }, [status, session, locale, dispatch]);

  return <>{children}</>;
}
