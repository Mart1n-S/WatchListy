"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/lib/redux/slices/userSlice";
import { RootState } from "@/lib/redux/store";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileBackground from "@/components/ui/ProfileBackground";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.user);

  // Synchronise NextAuth avec Redux
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(
        setUser({
          id: session.user.id || null,
          name: session.user.name || null,
          email: session.user.email || null,
          image: session.user.image || null,
          role: session.user.role || "user",
          createdAt: session.user.createdAt || null,
          isAuthenticated: true,
        })
      );
    }
  }, [session, status, dispatch]);

  // État de chargement (optionnel, car le middleware bloque déjà)
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg">Préparation de votre profil...</p>
        </div>
      </div>
    );
  }

  // Utilise les données fusionnées (Redux + NextAuth)
  const user = {
    ...session?.user,
    ...reduxUser,
    name: reduxUser.name || session?.user?.name,
    email: reduxUser.email || session?.user?.email,
    image: reduxUser.image || session?.user?.image,
    role: reduxUser.role || session?.user?.role || "user",
  };

  return (
    <div className="min-h-screen relative">
      <ProfileBackground />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
          <p className="text-slate-400">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
        <ProfileCard user={user} />
      </div>
    </div>
  );
}
