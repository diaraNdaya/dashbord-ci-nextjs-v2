"use client";

import { Input } from "@/components/ui/input";
import { CIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  value?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  placeholder = "Rechercher...",
  onSearch,
  onChange,
  value,
  debounceMs = 300,
  className = "",
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(value || "");

  // Debounce la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
      if (onChange) {
        onChange(searchQuery);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, onChange, debounceMs]);

  // Sync with external value prop
  useEffect(() => {
    if (value !== undefined && value !== searchQuery) {
      setSearchQuery(value);
    }
  }, [value]);

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <HugeiconsIcon
          icon={Search01Icon}
          className="h-4 w-4 text-muted-foreground"
        />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground text-muted-foreground transition-colors"
        >
          <HugeiconsIcon icon={CIcon} className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
