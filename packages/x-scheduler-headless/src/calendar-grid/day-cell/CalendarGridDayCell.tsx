'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useCompositeListItem } from '../../base-ui-copy/composite/list/useCompositeListItem';
import { useAdapterContext } from '../../use-adapter-context';
import { useEventCreation } from '../../internals/utils/useEventCreation';
import { useKeyboardEventCreation } from '../../internals/utils/useKeyboardEventCreation';
import { getNavigationTarget } from '../../internals/utils/getNavigationTarget';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
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
  const { focusedCell, setFocusedCell } = useCalendarGridRootContext();
  const { ref: listItemRef, index } = useCompositeListItem();
  const dropTargetRef = useDayCellDropTarget({ value, addPropertiesToDroppedEvent });

  const cellRef = React.useRef<HTMLDivElement>(null);
  const hasFocus = focusedCell?.rowType === 'day-grid' && focusedCell?.columnIndex === index;

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
    const target = getNavigationTarget(event.key, 'day-grid', index);
    if (target) {
      event.preventDefault();
      setFocusedCell(target.rowType, target.columnIndex);
      return;
    }

    if (event.key === 'Enter' && event.target === event.currentTarget && triggerKeyboardCreation) {
      event.preventDefault();
      triggerKeyboardCreation();
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setFocusedCell('day-grid', index);
    }
  };

  const contextValue: CalendarGridDayCellContext = React.useMemo(
    () => ({
      index,
    }),
    [index],
  );

  const keyboardProps = {
    role: 'gridcell' as const,
    // When no cell has been focused yet (focusedCell === null), use default tabIndex.
    // Once a cell is focused, use roving tabIndex (only the focused cell has tabIndex=0).
    tabIndex: focusedCell === null ? 0 : hasFocus ? 0 : -1,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef, listItemRef, cellRef],
    props: [elementProps, keyboardProps, eventCreationProps],
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
