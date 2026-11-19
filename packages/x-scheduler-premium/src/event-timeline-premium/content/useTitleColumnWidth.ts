'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import type { SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { observeResizeNextFrame } from './observeResizeNextFrame';

export const TITLE_HEADER_KEY = Symbol('title-header');

type Key = SchedulerResourceId | typeof TITLE_HEADER_KEY;
type Report = (key: Key, width: number) => void;

const Context = React.createContext<Report | null>(null);

export const TitleColumnWidthProvider = Context.Provider;

export function useTitleCellMeasurement(key: Key) {
  const report = React.useContext(Context)!;
  const cellRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const cell = cellRef.current;
    const content = contentRef.current;
    if (!cell || !content || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const measure = () => {
      // The cell already spans the whole column. Measure its max-content span and
      // include the cell padding, which also accounts for the resource's indentation.
      const style = getComputedStyle(cell);
      const padding = parseFloat(style.paddingInlineStart) + parseFloat(style.paddingInlineEnd);
      report(key, content.offsetWidth + padding);
    };
    measure();
    return observeResizeNextFrame(content, measure);
  }, [key, report]);

  return { cellRef, contentRef };
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

  const cache = React.useRef<Map<Key, number>>(new Map());
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

  useIsoLayoutEffect(() => {
    const valid = new Set<Key>(rows.map((r) => r.id));
    valid.add(TITLE_HEADER_KEY);
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
