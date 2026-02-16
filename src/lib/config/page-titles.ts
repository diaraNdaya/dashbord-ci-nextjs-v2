export const PAGE_TITLES = {
  "/": "Accueil",
  "/dashboard": "Tableau de bord",
  "/users": "Gestion des utilisateurs",
  "/products": "Gestion des produits",
  "/orders": "Gestion des commandes",
  "/finances": "Gestion financière",
  "/commissions": "Gestion des commissions",
  "/configuration": "Configuration",
  "/configuration/categories": "Catégories",
  "/configuration/subcategories": "Sous-catégories",
  "/configuration/commissions": "Configuration des commissions",
  "/configuration/documents": "Documents",
  "/configuration/reclamations": "Réclamations",
  "/configuration/banners": "Bannières",
  "/profile": "Profil",
  "/settings": "Paramètres",
} as const;

export type PagePath = keyof typeof PAGE_TITLES;

// Helper function to get page title
export function getPageTitle(pathname: string): string {
  const title = PAGE_TITLES[pathname as PagePath];
  if (title) {
    return title;
  }

  if (pathname === "/") {
    return "Accueil";
  }

  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (lastSegment) {
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return "Tableau de bord";
}

export function getParentPath(pathname: string): string | null {
  if (pathname.startsWith("/configuration/") && pathname !== "/configuration") {
    return "/configuration";
  }
  return null;
}

// Helper function to build breadcrumb trail
export function buildBreadcrumbTrail(pathname: string) {
  const trail: Array<{ title: string; path: string }> = [];

  // Add parent if exists
  const parentPath = getParentPath(pathname);
  if (parentPath) {
    trail.push({
      title: getPageTitle(parentPath),
      path: parentPath,
    });
  }

  // Add current page
  trail.push({
    title: getPageTitle(pathname),
    path: pathname,
  });

  return trail;
}
