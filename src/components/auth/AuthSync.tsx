"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useAppDispatch } from "@/lib/redux/hooks";

// Redux slices et thunks
import { setUser, clearUser } from "@/lib/redux/slices/userSlice";
import { fetchGenres } from "@/lib/redux/thunks/fetchGenres";
import { fetchUserMovies } from "@/lib/redux/thunks/userMoviesThunks";
import { clearUserMovies } from "@/lib/redux/slices/userMoviesSlice";
import { clearTmdbCache } from "@/lib/redux/slices/tmdbSlice";
import { fetchFollowingUsers } from "@/lib/redux/thunks/followThunks";
import { setFollowingUsers } from "@/lib/redux/slices/followingSlice";

export default function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const locale = useLocale();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // --- Hydrate Redux avec les infos NextAuth ---
      dispatch(
        setUser({
          id: session.user.id ?? null,
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
          role: session.user.role ?? "user",
          createdAt: session.user.createdAt ?? null,
          isAuthenticated: true,
          followingIds: session.user.followingIds ?? [],
          likedUsers: session.user.likedUsers ?? [],
          preferences: session.user.preferences ?? { movies: [], tv: [] },
        })
      );

      // --- Charge les données principales ---
      dispatch(fetchGenres(locale));
      dispatch(fetchUserMovies());
      dispatch(fetchFollowingUsers());
    } else if (status === "unauthenticated") {
      // --- Purge complète du store Redux ---
      dispatch(clearUser());
      dispatch(clearUserMovies());
      dispatch(clearTmdbCache());
      dispatch(setFollowingUsers([]));
    }
  }, [status, session, locale, dispatch]);

  return <>{children}</>;
}
