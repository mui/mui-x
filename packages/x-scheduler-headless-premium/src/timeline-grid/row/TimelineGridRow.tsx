'use client';
import * as React from 'react';
import {
  useRenderElement,
  BaseUIComponentProps,
  useCompositeListItem,
  useCompositeListContext,
} from '@mui/x-scheduler-headless/base-ui-copy';
import type { TimelineGridColumnType } from '../../models/timelineGrid';
import { useTimelineGridRootContext } from '../root/TimelineGridRootContext';

export const TimelineGridRow = React.forwardRef(function TimelineGridRow(
  componentProps: TimelineGridRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    columnType,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const isNavigable = columnType != null;

  // These hooks are only useful when the row is navigable,
  // but must be called unconditionally to follow the rules of hooks.
  const { focusedCell, setFocusedCell, columnTypes } = useTimelineGridRootContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const { elementsRef } = useCompositeListContext();

  const rowRef = React.useRef<HTMLDivElement>(null);
  const hasFocus =
    isNavigable && focusedCell?.columnType === columnType && focusedCell?.rowIndex === index;

  // Apply DOM focus when this row becomes the focused row
  React.useEffect(() => {
    if (hasFocus && rowRef.current && !rowRef.current.contains(document.activeElement)) {
      rowRef.current.focus({ preventScroll: true });
    }
  }, [hasFocus]);

  const handleKeyDown = isNavigable
    ? (event: React.KeyboardEvent<HTMLDivElement>) => {
        const totalRows = elementsRef.current.length;
        if (event.key === 'ArrowUp' && index > 0) {
          event.preventDefault();
          setFocusedCell({ columnType: columnType!, rowIndex: index - 1 });
          return;
        }
        if (event.key === 'ArrowDown' && index < totalRows - 1) {
          event.preventDefault();
          setFocusedCell({ columnType: columnType!, rowIndex: index + 1 });
          return;
        }
        if (event.key === 'ArrowRight') {
          const typeIndex = columnTypes.indexOf(columnType!);
          if (typeIndex >= 0 && typeIndex < columnTypes.length - 1) {
            event.preventDefault();
            setFocusedCell({ columnType: columnTypes[typeIndex + 1], rowIndex: index });
          }
          return;
        }
        if (event.key === 'ArrowLeft') {
          const typeIndex = columnTypes.indexOf(columnType!);
          if (typeIndex > 0) {
            event.preventDefault();
            setFocusedCell({ columnType: columnTypes[typeIndex - 1], rowIndex: index });
          }
        }
      }
    : undefined;

  const handleFocus = isNavigable
    ? (event: React.FocusEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          setFocusedCell({ columnType: columnType!, rowIndex: index });
        }
      }
    : undefined;

  const keyboardProps = isNavigable
    ? { tabIndex: 0, onKeyDown: handleKeyDown, onFocus: handleFocus }
    : undefined;

  return useRenderElement('div', componentProps, {
    ref: isNavigable ? [forwardedRef, listItemRef, rowRef] : [forwardedRef],
    props: [
      elementProps,
      { role: 'row', 'aria-rowindex': isNavigable ? index + 1 : undefined },
      keyboardProps,
    ],
  });
});

export namespace TimelineGridRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The column type this row belongs to.
     * When provided, the row becomes keyboard-navigable with arrow keys.
     * @default undefined
     */
    columnType?: TimelineGridColumnType;
  }
}
