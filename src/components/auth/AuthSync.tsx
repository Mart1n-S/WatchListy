'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setUser, clearUser } from '@/lib/redux/slices/userSlice';
import { fetchGenres } from '@/lib/redux/thunks/fetchGenres';

export default function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Hydrate Redux avec les infos de session
      dispatch(
        setUser({
          id: session.user.id ?? null,
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
          role: session.user.role ?? 'user',
          createdAt: session.user.createdAt ?? null,
          isAuthenticated: true,
          preferences: session.user.preferences ?? undefined,
        })
      );

      // Charge les genres TMDB (si pas encore en cache Redux/localStorage)
      dispatch(fetchGenres());
    } else if (status === 'unauthenticated') {
      dispatch(clearUser());
    }
  }, [session, status, dispatch]);

  return <>{children}</>;
}
