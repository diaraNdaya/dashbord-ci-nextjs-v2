import logoImage from "@/../public/images/about.webp";
import logoImg from "@/../public/images/logo.svg";
import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
enum MODE {
  DARK = "dark",
  LIGHT = "light",
}
export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const siteConfig = {
  title: "Ndaya",
  description: `L'application e-commerce révolutionnaire`,
  logo: logoImage,
  icon: logoImg,
  mode: MODE.LIGHT,
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description,
): Metadata => {
  return {
    title: title ? `${title} | Admin Ndaya` : siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} - Admin Ndaya` : title,
      description,
      url: "https://admin.ndaya.com",
      siteName: "Ndaya",
      images: {
        url: "https://ndaya.com/images/hero.webp",
        width: 1200,
        height: 630,
      },
      locale: "fr_CI",
      type: "website",
    },
  };
};
