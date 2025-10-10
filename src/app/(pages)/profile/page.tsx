"use client";

import { useSession } from "next-auth/react";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileBackground from "@/components/ui/ProfileBackground";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (session) {
     const user = session.user;

    return (
     <div className="min-h-screen relative">
        {/* Nouveau background */}
        <ProfileBackground />

        <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
            <p className="text-slate-400">Gérez vos informations personnelles et vos préférences</p>
          </div>

          <ProfileCard user={user} />
        </div>
      </div>
    );
  }
}