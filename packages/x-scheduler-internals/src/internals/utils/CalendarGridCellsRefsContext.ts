'use client';
import * as React from 'react';

/**
 * Fallback used when a cell is rendered outside of its container, which the tests do.
 * It mirrors the tolerant default of Base UI's `CompositeListContext`.
 */
const EMPTY_CELLS_REFS: React.RefObject<(HTMLDivElement | null)[]> = { current: [] };

/**
 * Exposes the `elementsRef` a calendar grid container passes to its `<CompositeList />`
 * so that the items of that list can read the column count for keyboard navigation.
 * Base UI's `CompositeListContext` no longer carries `elementsRef` since it moved to an
 * atomic item registry, so the ref is shared through this context instead.
 */
export const CalendarGridCellsRefsContext =
  React.createContext<React.RefObject<(HTMLDivElement | null)[]>>(EMPTY_CELLS_REFS);

export function useCalendarGridCellsRefsContext() {
  return React.useContext(CalendarGridCellsRefsContext);
}
