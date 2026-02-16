"use client";

import { useTheme } from "next-themes";
import { ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface LogoProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string;
  alt?: string;
}

export const Logo = ({ className, alt = "Site Logo", ...props }: LogoProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Éviter l'hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Afficher le logo dark par défaut pendant le chargement
    return (
      <div
        className={`md:w-52 h-13 w-32 relative flex justify-center items-center ${className}`}
      >
        <img
          src="/images/logo/logo-dark.webp"
          className="max-h-26"
          alt={alt}
          {...props}
        />
      </div>
    );
  }

  // Déterminer quel logo utiliser selon le thème
  const logoSrc =
    resolvedTheme === "dark"
      ? "/images/logo/logo.webp" // Logo clair pour le mode dark
      : "/images/logo/logo-dark.webp"; // Logo sombre pour le mode light

  return (
    <div
      className={`md:w-52 h-13 w-32 relative flex justify-center items-center ${className}`}
    >
      <img src={logoSrc} className="max-h-26" alt={alt} {...props} />
    </div>
  );
};
