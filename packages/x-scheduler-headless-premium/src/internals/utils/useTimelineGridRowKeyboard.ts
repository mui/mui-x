'use client';
import * as React from 'react';
import {
  useCompositeListItem,
  useCompositeListContext,
} from '@mui/x-scheduler-headless/base-ui-copy';
import type { TimelineGridColumnType } from '../../models/timelineGrid';
import { useTimelineGridRootContext } from '../../timeline-grid/root/TimelineGridRootContext';
import { useTimelineGridSubGridContext } from '../../timeline-grid/sub-grid/TimelineGridSubGridContext';

/**
 * Handles arrow-key navigation and focus syncing for a timeline grid row.
 */
export function useTimelineGridRowKeyboard(params: { columnType: TimelineGridColumnType }): {
  rowRef: React.RefObject<HTMLDivElement | null>;
  listItemRef: (node: HTMLDivElement | null) => void;
  index: number;
  hasFocus: boolean;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;
  handleFocus: (event: React.FocusEvent<HTMLDivElement>) => void;
} {
  const { columnType } = params;
  useTimelineGridSubGridContext();
  const { focusedCell, setFocusedCell, clearFocusedCellIfMatches, columnTypes } =
    useTimelineGridRootContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const { elementsRef } = useCompositeListContext();

  if (process.env.NODE_ENV !== 'production') {
    if (columnTypes.indexOf(columnType) === -1) {
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

  const indexRef = React.useRef(index);
  indexRef.current = index;
  // Unlike CalendarGrid, TimelineGrid rows can unmount while focused (e.g. programmatic
  // resource removal), so we clear focusedCell from the unmounting row to avoid a stale
  // pointer. `clearFocusedCellIfMatches` skips clearing when a sibling already took focus.
  React.useEffect(() => {
    return () => {
      clearFocusedCellIfMatches(columnType, indexRef.current);
    };
    // Cleanup must only run on unmount: `clearFocusedCellIfMatches` is stable and
    // `columnType` is a compile-time constant per hook caller (TitleRow/EventRow).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
    const totalRows = elementsRef.current.length;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index > 0) {
        setFocusedCell({ columnType, rowIndex: index - 1 });
      }
      return true;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (index < totalRows - 1) {
        setFocusedCell({ columnType, rowIndex: index + 1 });
      }
      return true;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const typeIndex = columnTypes.indexOf(columnType);
      if (typeIndex > 0) {
        setFocusedCell({ columnType: columnTypes[typeIndex - 1], rowIndex: index });
      }
      return true;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const typeIndex = columnTypes.indexOf(columnType);
      if (typeIndex >= 0 && typeIndex < columnTypes.length - 1) {
        setFocusedCell({ columnType: columnTypes[typeIndex + 1], rowIndex: index });
      }
      return true;
    }
    return false;
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setFocusedCell({ columnType, rowIndex: index });
    }
  };

  return { rowRef, listItemRef, index, hasFocus, handleKeyDown, handleFocus };
}
