'use client';
import * as React from 'react';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useCompositeListItem } from '@base-ui/react/internals/composite';
import { useDirection } from '@base-ui/react/direction-provider';
import { useAdapterContext } from '../../use-adapter-context';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerOtherSelectors } from '../../scheduler-selectors';
import { getEndOfDayMs, getStartOfDayMs } from '../../internals/utils/plain-date-utils/timeZone';
import { useEventCreation } from '../../internals/utils/useEventCreation';
import { getCalendarGridHeaderCellId } from '../../internals/utils/accessibility-utils';
import { useKeyboardEventCreation } from '../../internals/utils/useKeyboardEventCreation';
import { getNavigationTarget } from '../../internals/utils/getNavigationTarget';
import { useCalendarGridCellsRefsContext } from '../../internals/utils/CalendarGridCellsRefsContext';
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
  const store = useSchedulerStoreContext();
  const {
    id: rootId,
    focusedCell,
    setFocusedCell,
    rowTypes,
    rowsPerType,
  } = useCalendarGridRootContext();
  const isRtl = useDirection() === 'rtl';
  const { rowIndex } = useCalendarGridDayRowContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const cellsRefs = useCalendarGridCellsRefsContext();
  const dropTargetRef = useDayCellDropTarget({ value, addPropertiesToDroppedEvent });
  const columnHeaderId = getCalendarGridHeaderCellId(rootId, index);

  const cellRef = React.useRef<HTMLDivElement>(null);
  const hasFocus =
    focusedCell?.rowType === 'day-grid' &&
    focusedCell?.rowIndex === rowIndex &&
    focusedCell?.columnIndex === index;

  const getPlaceholderFields = () => {
    const timestamp = adapter.getTime(value);
    const displayTimezone = schedulerOtherSelectors.displayTimezone(store.state);
    return {
      surfaceType: 'day-grid' as const,
      start: getStartOfDayMs(timestamp, displayTimezone),
      end: getEndOfDayMs(timestamp, displayTimezone),
      lockSurfaceType,
      resourceId: null,
    };
  };

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
      columnCount: cellsRefs.current.length,
      rowTypes,
      rowsPerType,
      isRtl,
    });
    if (target) {
      event.preventDefault();
      setFocusedCell(target);
      return;
    }

    if (event.key === 'Enter' && event.target === event.currentTarget && triggerKeyboardCreation) {
      event.preventDefault();
      triggerKeyboardCreation(event.nativeEvent);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setFocusedCell({ rowType: 'day-grid', rowIndex, columnIndex: index });
    }
  };

  const contextValue: CalendarGridDayCellContext = React.useMemo(
    () => ({
      hasFocus,
    }),
    [hasFocus],
  );

  // Associate this cell with its column header.
  // Any additional aria-labelledby passed by the styled layer (e.g., an "All day" row header) is appended.
  const { 'aria-labelledby': elementAriaLabelledBy, ...restElementProps } = elementProps;
  const ariaLabelledBy = [columnHeaderId, elementAriaLabelledBy].filter(Boolean).join(' ');

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
      {
        role: 'gridcell',
        'aria-labelledby': ariaLabelledBy || undefined,
        'aria-colindex': index + 1,
      },
      keyboardProps,
      eventCreationProps,
      restElementProps,
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
