"use client";

import {
  formatDate,
  formatDateTime,
  formatRelativeDate,
} from "@/lib/utils/date";
import { useEffect, useState } from "react";

interface DateDisplayProps {
  date: string;
  format?: "date" | "datetime" | "relative";
  className?: string;
  fallback?: string;
}

/**
 * Composant pour afficher les dates de manière cohérente
 * et éviter les problèmes d'hydratation SSR
 */
export function DateDisplay({
  date,
  format = "date",
  className,
  fallback = "Date invalide",
}: DateDisplayProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pendant l'hydratation, afficher un placeholder
  if (!isClient) {
    return <span className={className}>--/--/----</span>;
  }

  // Une fois côté client, afficher la vraie date
  const formatters = {
    date: formatDate,
    datetime: formatDateTime,
    relative: formatRelativeDate,
  };

  const formattedDate = formatters[format](date);

  return (
    <span className={className} title={formatDateTime(date)}>
      {formattedDate || fallback}
    </span>
  );
}

/**
 * Version simplifiée pour les cas où on veut juste éviter l'hydratation
 */
export function SafeDateDisplay({
  date,
  className,
}: {
  date: string;
  className?: string;
}) {
  return <DateDisplay date={date} format="date" className={className} />;
}
