import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 sm:px-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-indigo-500">WatchListy</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl">
          Your ultimate app to track movies and series!
        </p>
      </header>

      <main className="flex flex-col items-center gap-8">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          className="dark:invert"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#"
            className="px-6 py-3 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
          >
            Get Started
          </a>
          <a
            href="#"
            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Learn More
          </a>
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} WatchListy. All rights reserved.
      </footer>
    </div>
  );
}
