"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUser, clearUser } from "@/lib/redux/slices/userSlice";
import { fetchGenres } from "@/lib/redux/thunks/fetchGenres";
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

      // Charge les genres TMDB selon la locale active
      dispatch(fetchGenres(locale));
    } else if (status === "unauthenticated") {
      dispatch(clearUser());
    }
  }, [session, status, locale, dispatch]);

  return <>{children}</>;
}
