"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { buildBreadcrumbTrail } from "@/lib/config/page-titles";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { UserProfileDropdown } from "../common/user-profile-dropdown";
import { ThemeSwitcher } from "../theme-switcher";

export function SidebarContentHeader() {
  const pathname = usePathname();
  const breadcrumbTrail = useMemo(() => {
    const trail = buildBreadcrumbTrail(pathname);
    return trail;
  }, [pathname]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
      <SidebarTrigger
        className="-ml-1"
        style={{ opacity: 1, visibility: "visible" }}
      />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbTrail.map((item, index) => {
            const isLast = index === breadcrumbTrail.length - 1;
            return (
              <div
                key={`breadcrumb-${index}-${item.title}`}
                className="flex items-center"
              >
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.path}>
                      {item.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <ThemeSwitcher />
        <UserProfileDropdown />
      </div>
    </header>
  );
}
