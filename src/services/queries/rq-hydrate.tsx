import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";

type Props = {
  prefetch?: (qc: QueryClient) => Promise<void> | void;
  children: React.ReactNode;
};

export default async function RQHydrate({ prefetch, children }: Props) {
  const qc = new QueryClient();

  if (prefetch) {
    await prefetch(qc);
  }

  return <HydrationBoundary state={dehydrate(qc)}>{children}</HydrationBoundary>;
}
