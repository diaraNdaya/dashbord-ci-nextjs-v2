"use client";

export const unwrapData = (raw: unknown): unknown => {
  let current = raw;

  for (let i = 0; i < 5; i += 1) {
    if (
      current &&
      typeof current === "object" &&
      "data" in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>).data;
      continue;
    }
    break;
  }

  return current;
};

export const toArrayFromPayload = <T>(raw: unknown): T[] => {
  const unwrapped = unwrapData(raw);

  if (Array.isArray(unwrapped)) return unwrapped as T[];
  if (
    unwrapped &&
    typeof unwrapped === "object" &&
    Array.isArray((unwrapped as { data?: unknown[] }).data)
  ) {
    return (unwrapped as { data: T[] }).data;
  }

  return [];
};
