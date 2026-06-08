'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type { TimelineGridColumnType } from '../../models/timelineGrid';
import { useTimelineGridRootContext } from '../../timeline-grid/root/TimelineGridRootContext';
import { useTimelineGridBodyRowContext } from '../../timeline-grid/body-row/TimelineGridBodyRowContext';

/**
 * Handles arrow-key navigation and focus syncing for a timeline grid row cell.
 *
 * Must be used inside a `<TimelineGrid.BodyRow />`. The component inherits its
 * index from the parent row and acts as a focusable cell within it.
 * Uses `totalRowCount` from the root context for bounds checking, which works
 * correctly with virtualization where only a subset of rows exist in the DOM.
 */
export function useTimelineGridRowKeyboard(params: { columnType: TimelineGridColumnType }): {
  rowRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  hasFocus: boolean;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
  handleFocus: (event: React.FocusEvent<HTMLDivElement>) => void;
} {
  const { columnType } = params;
  const { focusedCell, setFocusedCell, clearFocusedCellIfMatches, columnTypes, totalRowCount } =
    useTimelineGridRootContext();

  const bodyRowContext = useTimelineGridBodyRowContext();
  const index = bodyRowContext.index;

  if (process.env.NODE_ENV !== 'production') {
    if (columnTypes.indexOf(columnType) === -1) {
      // TODO: fix mui/no-guarded-throw
      // eslint-disable-next-line mui/no-guarded-throw
      throw new Error(
        `MUI X Scheduler: The column type "${columnType}" is not listed in the \`columnTypes\` prop of <TimelineGrid.Root />. ` +
          `Add "${columnType}" to \`columnTypes\` so the row can participate in arrow-key navigation.`,
      );
    }
  }

  const rowRef = React.useRef<HTMLDivElement>(null);
  const hasFocus = focusedCell?.columnType === columnType && focusedCell?.rowIndex === index;

  React.useEffect(() => {
    if (hasFocus && rowRef.current && !rowRef.current.contains(document.activeElement)) {
      rowRef.current.focus({ preventScroll: true });
    }
  }, [hasFocus]);

  // Clear focusedCell on unmount if this row still owns it.
  const clearOnUnmount = useStableCallback(() => {
    clearFocusedCellIfMatches(columnType, index);
  });
  React.useEffect(() => clearOnUnmount, [clearOnUnmount]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
    const typeIndex = columnTypes.indexOf(columnType);

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index > 0) {
        setFocusedCell({ columnType, rowIndex: index - 1 });
      }
      return true;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (index < totalRowCount - 1) {
        setFocusedCell({ columnType, rowIndex: index + 1 });
      }
      return true;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (typeIndex > 0) {
        setFocusedCell({ columnType: columnTypes[typeIndex - 1], rowIndex: index });
      }
      return true;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (typeIndex < columnTypes.length - 1) {
        setFocusedCell({ columnType: columnTypes[typeIndex + 1], rowIndex: index });
      }
      return true;
    }
    return false;
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (rowRef.current?.contains(event.target)) {
      setFocusedCell({ columnType, rowIndex: index });
    }
  };

  return { rowRef, index, hasFocus, handleKeyDown, handleFocus };
}
