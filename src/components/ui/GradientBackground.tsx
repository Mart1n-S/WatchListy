import { gradientBackground } from "../../lib/animation";

export function GradientBackground({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={gradientBackground}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-emerald-500/5 to-purple-500/5" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
