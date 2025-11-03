import { Suspense } from "react";
import VerifyEmailClient from "@/components/auth/VerifyEmail";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[calc(100dvh-5rem)] text-gray-300">
          Chargement...
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
