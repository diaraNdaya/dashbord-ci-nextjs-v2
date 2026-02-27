"use client";

import { SearchInput } from "./SearchInput";

interface TableSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function TableSearchBar({
  onSearch,
  placeholder = "Rechercher...",
  className = "",
}: TableSearchBarProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex-1 max-w-sm">
        <SearchInput
          placeholder={placeholder}
          onSearch={onSearch}
          debounceMs={300}
        />
      </div>
    </div>
  );
}
