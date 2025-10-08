"use client";

export default function BackgroundCinematic() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
    >
      {/* Halo doux (dégradé radial bleu/violet) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(99,102,241,0.25),rgba(15,23,42,0)_70%)] blur-3xl" />

      {/* Texture subtile (grille + bruit léger) */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'2\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\'/></svg>')]" />
    </div>
  );
}
