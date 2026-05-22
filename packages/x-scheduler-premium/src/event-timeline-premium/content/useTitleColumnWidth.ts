'use client';
import * as React from 'react';
import type { SchedulerResourceId } from '@mui/x-scheduler-internals/models';

type Report = (resourceId: SchedulerResourceId, width: number) => void;

const Context = React.createContext<Report | null>(null);

export const TitleColumnWidthProvider = Context.Provider;

export function useReportTitleWidth(): Report {
  const report = React.useContext(Context);
  if (!report) {
    throw new Error('MUI X Scheduler: TitleColumnWidthProvider is missing.');
  }
  return report;
}

/**
 * Tracks each rendered title cell's natural width and exposes the max
 * across all known resources, so virtualized-out rows still keep their
 * cached width and the column auto-sizes to fit the widest title.
 *
 * When `maxWidth` is provided, the visible column `width` is capped at it,
 * while `contentWidth` keeps the uncapped natural width so a horizontal
 * scrollbar can scroll the overflow.
 */
export function useTitleColumnWidth<T extends { id: SchedulerResourceId }>(parameters: {
  minWidth: number;
  maxWidth?: number;
  rows: readonly T[];
}) {
  const { minWidth, maxWidth, rows } = parameters;

  const cache = React.useRef<Map<SchedulerResourceId, number>>(new Map());
  const [observed, setObserved] = React.useState(0);

  const recompute = React.useCallback(() => {
    let max = 0;
    for (const w of cache.current.values()) {
      if (w > max) {
        max = w;
      }
    }
    setObserved((prev) => (prev === max ? prev : max));
  }, []);

  const report = React.useCallback<Report>(
    (id, width) => {
      if (cache.current.get(id) === width) {
        return;
      }
      cache.current.set(id, width);
      recompute();
    },
    [recompute],
  );

  React.useEffect(() => {
    const valid = new Set(rows.map((r) => r.id));
    let removed = false;
    for (const id of Array.from(cache.current.keys())) {
      if (!valid.has(id)) {
        cache.current.delete(id);
        removed = true;
      }
    }
    if (removed) {
      recompute();
    }
  }, [rows, recompute]);

  const contentWidth = Math.max(minWidth, observed);
  const width =
    maxWidth != null && maxWidth > 0
      ? Math.min(contentWidth, Math.max(minWidth, maxWidth))
      : contentWidth;
  const hasOverflow = contentWidth > width;

  return { width, contentWidth, hasOverflow, report };
}
