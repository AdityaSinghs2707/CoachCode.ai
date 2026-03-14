export function Skeleton({ width, height = 16, className = "" }) {
  return (
    <div
      className={className}
      style={{
        width: width || "100%",
        height,
        background: "linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        borderRadius: 4,
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <Skeleton height={24} width="60%" />
      <Skeleton height={14} style={{ marginBottom: 8 }} />
      <Skeleton height={14} width="80%" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="card">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: i < rows - 1 ? "1px solid var(--border)" : "none" }}>
          <Skeleton width={120} height={20} />
          <Skeleton width={180} height={20} />
          <Skeleton width={80} height={20} />
        </div>
      ))}
    </div>
  );
}
