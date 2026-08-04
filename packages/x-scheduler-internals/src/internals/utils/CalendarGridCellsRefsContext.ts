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
 * TODO: Read it from Base UI's `useCompositeListContext` once it is exported from `@base-ui/react/internals/composite`.
 */
export const CalendarGridCellsRefsContext =
  React.createContext<React.RefObject<(HTMLDivElement | null)[]>>(EMPTY_CELLS_REFS);

export function useCalendarGridCellsRefsContext() {
  return React.useContext(CalendarGridCellsRefsContext);
}
