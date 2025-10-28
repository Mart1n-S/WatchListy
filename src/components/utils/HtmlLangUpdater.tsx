"use client";
import { useEffect } from "react";

/**
 * Met à jour dynamiquement la balise <html lang="..."> côté client
 * pour refléter la locale active (fr, en, etc.).
 */
export function HtmlLangUpdater({ locale }: { locale: string }) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
