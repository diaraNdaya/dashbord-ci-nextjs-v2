"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ArrowRight01Icon,
  ComputerIcon,
  Moon01Icon,
  Package01Icon,
  Settings01Icon,
  ShoppingCart01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Logo } from "./common/Logo";

interface NavItem {
  title: string;
  url: string;
  icon?: readonly (readonly [
    string,
    { readonly [key: string]: string | number },
  ])[]; // Hugeicons icon type
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const data: { sections: NavSection[] } = {
  sections: [
    {
      title: "TABLEAU DE BORD",
      items: [
        {
          title: "Tableau de bord",
          url: "/dashboard",
          icon: Sun01Icon,
        },
      ],
    },
    {
      title: "GESTION",
      items: [
        {
          title: "Utilisateurs",
          url: "/users",
          icon: Moon01Icon,
        },
        {
          title: "Produits",
          url: "/products",
          icon: Package01Icon,
        },
        {
          title: "Commandes",
          url: "/orders",
          icon: ShoppingCart01Icon,
        },
        {
          title: "Finances",
          url: "/finances",
          icon: ComputerIcon,
        },
        {
          title: "Commissions",
          url: "/commissions",
          icon: ComputerIcon,
        },
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        {
          title: "Configuration",
          url: "/configuration",
          icon: Settings01Icon,
          items: [
            {
              title: "Catégories",
              url: "/configuration/categories",
            },
            {
              title: "Sous-catégories",
              url: "/configuration/subcategories",
            },
            {
              title: "Commissions",
              url: "/configuration/commissions",
            },
            {
              title: "Documents",
              url: "/configuration/documents",
            },
            {
              title: "Réclamations",
              url: "/configuration/reclamations",
            },
            {
              title: "Bannières",
              url: "/configuration/banners",
            },
          ],
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Function to check if a path is active
  const isPathActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === url;
  };

  const isParentPathActive = (item: NavItem) => {
    if (item.items && item.items.length > 0) {
      // Check if any child is active
      const hasActiveChild = item.items.some(
        (subItem) => pathname === subItem.url,
      );
      // Only activate parent if no child is active and we're on the parent URL
      return !hasActiveChild && pathname === item.url;
    }
    // For items without children, use normal path matching
    return pathname.startsWith(item.url);
  };

  const shouldExpandParent = (item: NavItem) => {
    if (!item.items) return false;
    return item.items.some((subItem) => isPathActive(subItem.url));
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-20 items-center justify-center rounded-lg overflow-hidden">
                  <Logo />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-lg">Administration</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                if (item.items && item.items.length > 0) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={shouldExpandParent(item)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isParentPathActive(item)}
                          >
                            {Icon && (
                              <HugeiconsIcon
                                icon={Icon}
                                strokeWidth={2}
                                className="size-4"
                              />
                            )}
                            <span>{item.title}</span>
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              strokeWidth={2}
                              className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isPathActive(subItem.url)}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isParentPathActive(item)}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        {Icon && (
                          <HugeiconsIcon
                            icon={Icon}
                            strokeWidth={2}
                            className="size-4"
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
