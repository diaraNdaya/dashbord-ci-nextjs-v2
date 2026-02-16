import { getPageTitle } from "@/lib/config/page-titles";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

/**
 * Hook to get the current page title based on the pathname
 * This ensures consistency between metadata and UI display
 */
export function usePageTitle(): string {
  const pathname = usePathname();

  return useMemo(() => {
    return getPageTitle(pathname);
  }, [pathname]);
}
