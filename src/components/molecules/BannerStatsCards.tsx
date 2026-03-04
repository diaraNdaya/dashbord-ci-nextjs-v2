import { BannerStatsCard } from "@/components/atoms/BannerStatsCard";
import type { Banner } from "@/lib/types/banner.types";

interface BannerStatsCardsProps {
  banners: Banner[];
}

export function BannerStatsCards({ banners }: BannerStatsCardsProps) {
  const activeCount = banners.filter(
    (banner: Banner) => banner.provider === "BANNER",
  ).length;

  const totalCount = banners.length;

  const thisMonthCount = banners.filter((banner: Banner) => {
    const createdThisMonth =
      new Date(banner.createdAt).getMonth() === new Date().getMonth();
    return createdThisMonth;
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <BannerStatsCard title="Total Bannières" value={totalCount} delay={0.1} />
      <BannerStatsCard
        title="Actives"
        value={activeCount}
        className="text-green-600"
        delay={0.2}
      />
      <BannerStatsCard
        title="Ce Mois"
        value={thisMonthCount}
        className="text-blue-600"
        delay={0.3}
      />
    </div>
  );
}
