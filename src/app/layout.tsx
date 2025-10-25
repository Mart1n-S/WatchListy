export default function RootPassThroughLayout({ children }: { children: React.ReactNode }) {
  // PAS de <html> ou <body> ici, c'est géré par [locale]/layout.tsx
  return children;
}