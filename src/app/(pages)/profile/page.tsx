import { auth } from "../../../auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Profil de {session.user.pseudo}</h1>
        <div className="flex items-center mb-4">
            <Image
            src={`/images/avatars/${session.user.avatar}`}
            alt="Avatar"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full mr-4"
            />
          <div>
            <p className="text-gray-700">Email: {session.user.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <a
            href="/api/auth/signout"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Se déconnecter
          </a>
        </div>
      </div>
    </div>
  );
}
