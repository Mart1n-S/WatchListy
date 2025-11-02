"use client";

import { useSession } from "next-auth/react";
import { useAppSelector } from "@/lib/redux/hooks";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileBackground from "@/components/ui/ProfileBackground";
import UserListsSection from "@/components/profile/UserListsSection";
import UserFollowingSection from "@/components/profile/UserFollowingSection";
import { useTranslations } from "next-intl";

export default function ProfileClient() {
  const { status } = useSession();
  const user = useAppSelector((state) => state.user);
  const t = useTranslations("profile");

  if (status === "loading" || !user.isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300 text-lg">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileBackground />
      <ProfileCard user={user} />
      <UserListsSection />
      <div className="mt-10">
        <UserFollowingSection />
      </div>
    </>
  );
}
