import { AppSidebar } from "@/components/app-sidebar";
import { SidebarContentHeader } from "@/components/molecules/SidebarContentHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="bg-slate-200 dark:bg-background">
        <SidebarContentHeader />
        <main className="p-2 lg:p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
