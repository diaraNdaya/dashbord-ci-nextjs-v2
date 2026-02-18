"use client";

import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
}

export function ErrorMessage({
  title,
  buttonText,
  onButtonClick,
}: ErrorMessageProps) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">{title}</p>
        <Button variant="outline" onClick={onButtonClick} className="mt-4">
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
