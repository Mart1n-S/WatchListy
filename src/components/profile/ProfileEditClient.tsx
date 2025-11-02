"use client";

import { useSession } from "next-auth/react";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

export default function ProfileEditClient() {
  const { data: session, status } = useSession();

  // État de chargement
  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ProfileEditForm user={session.user} />
    </>
  );
}
