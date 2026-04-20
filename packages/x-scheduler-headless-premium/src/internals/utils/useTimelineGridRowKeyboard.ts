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
  const { focusedCell, setFocusedCell, columnTypes } = useTimelineGridRootContext();
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

  const hasFocusRef = React.useRef(hasFocus);
  hasFocusRef.current = hasFocus;
  React.useEffect(() => {
    return () => {
      if (hasFocusRef.current) {
        setFocusedCell(null);
      }
    };
  }, [setFocusedCell]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
    const totalRows = elementsRef.current.length;
    if (event.key === 'ArrowUp' && index > 0) {
      event.preventDefault();
      setFocusedCell({ columnType, rowIndex: index - 1 });
      return true;
    }
    if (event.key === 'ArrowDown' && index < totalRows - 1) {
      event.preventDefault();
      setFocusedCell({ columnType, rowIndex: index + 1 });
      return true;
    }
    if (event.key === 'ArrowLeft') {
      const typeIndex = columnTypes.indexOf(columnType);
      if (typeIndex > 0) {
        event.preventDefault();
        setFocusedCell({ columnType: columnTypes[typeIndex - 1], rowIndex: index });
        return true;
      }
      return false;
    }
    if (event.key === 'ArrowRight') {
      const typeIndex = columnTypes.indexOf(columnType);
      if (typeIndex >= 0 && typeIndex < columnTypes.length - 1) {
        event.preventDefault();
        setFocusedCell({ columnType: columnTypes[typeIndex + 1], rowIndex: index });
        return true;
      }
      return false;
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
