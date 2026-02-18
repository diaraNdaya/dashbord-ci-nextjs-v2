"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  logoutMutationOptions,
  meQueryOptions,
} from "@/services/queries/auth.queries";
import {
  ArrowDown01Icon,
  Logout01Icon,
  Settings01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserProfileDropdown() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser, isLoading, error } = useQuery(meQueryOptions());

  const logoutMutation = useMutation({
    ...logoutMutationOptions(),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.clear();
        router.push("/login");
      }
    },
    onError: (error) => {
      console.error("Erreur lors de la déconnexion:", error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3">
        {/* Avatar skeleton */}
        <Skeleton className="h-8 w-8 rounded-full" />

        {/* Text skeleton - visible only on md+ screens like the real component */}
        <div className="hidden md:flex flex-col items-start gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* Arrow skeleton */}
        <Skeleton className="h-4 w-4 ml-1" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error.message}</div>;
  }

  if (!currentUser) {
    return <div className="text-red-600">Utilisateur non trouvé</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-vif font-bold text-white dark:bg-primary dark:text-primary-foreground">
            <HugeiconsIcon
              icon={Sun01Icon}
              strokeWidth={2}
              className="h-4 w-4"
            />
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium">{currentUser.username}</span>
            <span className="text-xs text-muted-foreground">
              {currentUser.email}
            </span>
          </div>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="h-4 w-4"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <HugeiconsIcon
              icon={Sun01Icon}
              strokeWidth={2}
              className="mr-2 h-4 w-4"
            />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <HugeiconsIcon
              icon={Settings01Icon}
              strokeWidth={2}
              className="mr-2 h-4 w-4"
            />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <HugeiconsIcon
            icon={Logout01Icon}
            strokeWidth={2}
            className="mr-2 h-4 w-4"
          />
          <span>
            {logoutMutation.isPending ? "Déconnexion..." : "Se déconnecter"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
