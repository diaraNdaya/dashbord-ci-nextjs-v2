"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPeriodSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function FilterPeriodSelect({ value, onChange }: FilterPeriodSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Periode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">Semaine</SelectItem>
        <SelectItem value="month">Mois</SelectItem>
        <SelectItem value="year">Annee</SelectItem>
      </SelectContent>
    </Select>
  );
}
