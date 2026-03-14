import { useState, useMemo } from "react";

export function usePagination(items, defaultLimit = 10) {
  const [page, setPage] = useState(1);
  const [limit] = useState(defaultLimit);

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return items.slice(start, start + limit);
  }, [items, page, limit]);

  const totalPages = Math.ceil(items.length / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    paginated,
    page,
    setPage,
    totalPages,
    hasNext,
    hasPrev,
    limit,
    total: items.length,
  };
}
