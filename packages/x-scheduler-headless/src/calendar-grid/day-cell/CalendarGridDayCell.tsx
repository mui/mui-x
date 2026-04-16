'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useCompositeListItem } from '../../base-ui-copy/composite/list/useCompositeListItem';
import { useCompositeListContext } from '../../base-ui-copy/composite/list/CompositeListContext';
import { useAdapterContext } from '../../use-adapter-context';
import { useEventCreation } from '../../internals/utils/useEventCreation';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { useKeyboardEventCreation } from '../../internals/utils/useKeyboardEventCreation';
import { getNavigationTarget } from '../../internals/utils/getNavigationTarget';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import { useDayCellDropTarget } from './useDayCellDropTarget';
import { CalendarGridDayCellContext } from './CalendarGridDayCellContext';

export const CalendarGridDayCell = React.forwardRef(function CalendarGridDayCell(
  componentProps: CalendarGridDayCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    value,
    addPropertiesToDroppedEvent,
    lockSurfaceType,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const adapter = useAdapterContext();
  const { id: rootId, focusedCell, setFocusedCell, rowTypes, rowsPerType } = useCalendarGridRootContext();
  const { rowIndex } = useCalendarGridDayRowContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const { elementsRef } = useCompositeListContext();
  const dropTargetRef = useDayCellDropTarget({ value, addPropertiesToDroppedEvent });
  const columnHeaderId = getCalendarGridHeaderCellId(rootId, index);

  const cellRef = React.useRef<HTMLDivElement>(null);
  const hasFocus =
    focusedCell?.rowType === 'day-grid' &&
    focusedCell?.rowIndex === rowIndex &&
    focusedCell?.columnIndex === index;

  const getPlaceholderFields = () => ({
    surfaceType: 'day-grid' as const,
    start: adapter.startOfDay(value),
    end: adapter.endOfDay(value),
    lockSurfaceType,
    resourceId: null,
  });

  const eventCreationProps = useEventCreation(getPlaceholderFields);
  const triggerKeyboardCreation = useKeyboardEventCreation(getPlaceholderFields);

  // Apply DOM focus when this cell becomes the focused cell
  React.useEffect(() => {
    if (hasFocus && cellRef.current && !cellRef.current.contains(document.activeElement)) {
      cellRef.current.focus({ preventScroll: true });
    }
  }, [hasFocus]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = getNavigationTarget(event.key, 'day-grid', rowIndex, index, {
      columnCount: elementsRef.current.length,
      rowTypes,
      rowsPerType,
    });
    if (target) {
      event.preventDefault();
      setFocusedCell(target);
      return;
    }

    if (event.key === 'Enter' && event.target === event.currentTarget && triggerKeyboardCreation) {
      event.preventDefault();
      triggerKeyboardCreation();
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setFocusedCell({ rowType: 'day-grid', rowIndex, columnIndex: index });
    }
  };

  const contextValue: CalendarGridDayCellContext = React.useMemo(
    () => ({
      index,
      hasFocus,
    }),
    [index, hasFocus],
  );

  // Associate this cell with its column header, matching the pattern used by DayEvent and TimeEvent.
  // Any additional aria-labelledby passed by the styled layer (e.g., an "All day" row header) is appended.
  const ariaLabelledBy = [columnHeaderId, elementProps['aria-labelledby']]
    .filter(Boolean)
    .join(' ');

  const keyboardProps = {
    // All cells are always tabbable so Tab flows through: cell → events → next cell → events.
    // Arrow keys navigate programmatically via setFocusedCell, independent of tabIndex.
    tabIndex: 0,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, listItemRef, cellRef],
    props: [
      elementProps,
      { role: 'gridcell', 'aria-labelledby': ariaLabelledBy || undefined },
      keyboardProps,
      eventCreationProps,
    ],
  });

  return (
    <CalendarGridDayCellContext.Provider value={contextValue}>
      {element}
    </CalendarGridDayCellContext.Provider>
  );
});

export namespace CalendarGridDayCell {
  export interface State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useDayCellDropTarget.Parameters {
    /**
     * Whether to lock the surface type of the created event placeholder.
     * When true, the surfaceType will not be updated when editing the placeholder.
     */
    lockSurfaceType?: boolean;
  }
}
