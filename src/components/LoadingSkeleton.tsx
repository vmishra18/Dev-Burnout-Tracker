export function DashboardSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-panel h-72 animate-pulse rounded-[32px] bg-card/60" />
        <div className="glass-panel h-72 animate-pulse rounded-[32px] bg-card/60" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="glass-panel h-40 animate-pulse rounded-[28px] bg-card/60"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="glass-panel h-96 animate-pulse rounded-[28px] bg-card/60"
          />
        ))}
      </div>
    </div>
  );
}
