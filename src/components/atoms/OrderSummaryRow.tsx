"use client";

interface OrderSummaryRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

export function OrderSummaryRow({
  label,
  value,
  isTotal = false,
}: OrderSummaryRowProps) {
  if (isTotal) {
    return (
      <div className="flex justify-between text-lg font-bold">
        <span>{label}</span>
        <span>{value}</span>
      </div>
    );
  }

  return (
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
