"use client";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({
  message = "Chargement...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-muted-foreground">{message}</div>
    </div>
  );
}
