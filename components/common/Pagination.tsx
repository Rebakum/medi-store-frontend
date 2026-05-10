"use client";

import { useMemo } from "react";

type Props = {
  page: number;
  totalPages?: number; 
  total?: number; 
  limit?: number; 
  siblingCount?: number; 
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

function range(start: number, end: number) {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

export default function Pagination({
  page,
  totalPages = 1,
  total,
  limit,
  siblingCount = 2,
  onPageChange,
  disabled = false,
}: Props) {
  const pages = useMemo(() => {
    const tp = Math.max(1, totalPages);
    const start = Math.max(1, page - siblingCount);
    const end = Math.min(tp, page + siblingCount);

    // expand to keep size consistent
    let s = start;
    let e = end;

    while (e - s < siblingCount * 2 && (s > 1 || e < tp)) {
      if (s > 1) s--;
      else if (e < tp) e++;
      else break;
    }

    return range(s, e);
  }, [page, totalPages, siblingCount]);

  const canPrev = page > 1;
  const canNext = page < Math.max(1, totalPages);

  const go = (p: number) => {
    if (disabled) return;
    if (p < 1 || p > totalPages) return;
    if (p === page) return;
    onPageChange(p);
  };

  const tp = Math.max(1, totalPages);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Summary */}
      <div className="text-xs text-slate-600 dark:text-slate-300">
        {typeof total === "number" && typeof limit === "number" ? (
          <>
            Page <b>{page}</b> of <b>{tp}</b> — Total <b>{total}</b>
          </>
        ) : (
          <>
            Page <b>{page}</b> of <b>{tp}</b>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          disabled={disabled || !canPrev}
          onClick={() => go(page - 1)}
          className="px-3 py-2 text-xs bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 disabled:opacity-50"
        >
          Prev
        </button>

        {/* First */}
        {pages[0] !== 1 && (
          <>
            <button
              disabled={disabled}
              onClick={() => go(1)}
              className={`px-3 py-2 rounded-lg text-xs border ${
                page === 1
                  ? "border-blue-600 text-white bg-gradient-to-r from-blue-600 to-indigo-600"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100"
              }`}
            >
              1
            </button>
            <span className="px-1 text-slate-400">…</span>
          </>
        )}

        {/* Middle */}
        {pages.map((p) => (
          <button
            key={p}
            disabled={disabled}
            onClick={() => go(p)}
            className={`px-3 py-2 rounded-lg text-xs border ${
              p === page
                ? "border-blue-600 text-white bg-gradient-to-r from-blue-600 to-indigo-600"
                : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Last */}
        {pages[pages.length - 1] !== tp && (
          <>
            <span className="px-1 text-slate-400">…</span>
            <button
              disabled={disabled}
              onClick={() => go(tp)}
              className={`px-3 py-2 rounded-lg text-xs border ${
                page === tp
                  ? "border-blue-600 text-white bg-gradient-to-r from-blue-600 to-indigo-600"
                  : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100"
              }`}
            >
              {tp}
            </button>
          </>
        )}

        <button
          disabled={disabled || !canNext}
          onClick={() => go(page + 1)}
          className="px-3 py-2 text-xs bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
