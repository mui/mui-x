'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useCompositeListItem } from '../../base-ui-copy/composite/list/useCompositeListItem';
import { useCompositeListContext } from '../../base-ui-copy/composite/list/CompositeListContext';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useAdapterContext } from '../../use-adapter-context';
import { schedulerNowSelectors } from '../../scheduler-selectors';
import { EVENT_CREATION_PRECISION_MINUTE } from '../../constants';
import { useEventCreation } from '../../internals/utils/useEventCreation';
import { useKeyboardEventCreation } from '../../internals/utils/useKeyboardEventCreation';
import { getNavigationTarget } from '../../internals/utils/getNavigationTarget';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { CalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { useTimeDropTarget } from './useTimeDropTarget';

export const CalendarGridTimeColumn = React.forwardRef(function CalendarGridTimeColumn(
  componentProps: CalendarGridTimeColumn.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    start,
    end,
    addPropertiesToDroppedEvent,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const adapter = useAdapterContext();
  const store = useEventCalendarStoreContext();
  const { focusedCell, setFocusedCell, rowTypes, rowCounts } = useCalendarGridRootContext();
  const isCurrentDay = useStore(store, schedulerNowSelectors.isCurrentDay, start);
  const { ref: listItemRef, index } = useCompositeListItem();
  const { elementsRef } = useCompositeListContext();

  const cellRef = React.useRef<HTMLDivElement>(null);
  const hasFocus =
    focusedCell?.rowType === 'time-grid' &&
    focusedCell?.rowIndex === 0 &&
    focusedCell?.columnIndex === index;

  const { getCursorPositionInElementMs, ref: dropTargetRef } = useTimeDropTarget({
    start,
    end,
    addPropertiesToDroppedEvent,
  });

  const eventCreationProps = useEventCreation(({ event, creationConfig }) => {
    const offsetMs = getCursorPositionInElementMs({
      input: { clientY: event.clientY },
      elementRef: dropTargetRef,
    });
    const anchor = adapter.addMilliseconds(start, offsetMs);
    const startDate = adapter.addMinutes(
      anchor,
      -(adapter.getMinutes(anchor) % EVENT_CREATION_PRECISION_MINUTE),
    );
    return {
      surfaceType: 'time-grid' as const,
      start: startDate,
      end: adapter.addMinutes(startDate, creationConfig.duration),
      resourceId: null,
    };
  });

  const triggerKeyboardCreation = useKeyboardEventCreation(({ creationConfig }) => {
    const noon = adapter.setHours(adapter.setMinutes(start, 0), 12);
    return {
      surfaceType: 'time-grid' as const,
      start: noon,
      end: adapter.addMinutes(noon, creationConfig.duration),
      resourceId: null,
    };
  });

  // Apply DOM focus when this cell becomes the focused cell
  React.useEffect(() => {
    if (hasFocus && cellRef.current && !cellRef.current.contains(document.activeElement)) {
      cellRef.current.focus({ preventScroll: true });
    }
  }, [hasFocus]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = getNavigationTarget(event.key, 'time-grid', 0, index, {
      columnCount: elementsRef.current.length,
      rowTypes,
      rowCounts,
    });
    if (target) {
      event.preventDefault();
      setFocusedCell(target.rowType, target.rowIndex, target.columnIndex);
      return;
    }

    if (event.key === 'Enter' && event.target === event.currentTarget && triggerKeyboardCreation) {
      event.preventDefault();
      triggerKeyboardCreation();
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setFocusedCell('time-grid', 0, index);
    }
  };

  const state: CalendarGridTimeColumn.State = React.useMemo(
    () => ({
      current: isCurrentDay,
    }),
    [isCurrentDay],
  );

  const contextValue: CalendarGridTimeColumnContext = React.useMemo(
    () => ({
      start,
      end,
      index,
      hasFocus,
      getCursorPositionInElementMs,
    }),
    [start, end, index, hasFocus, getCursorPositionInElementMs],
  );

  const keyboardProps = {
    tabIndex: 0,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, dropTargetRef, listItemRef, cellRef],
    props: [elementProps, { role: 'gridcell' }, keyboardProps, eventCreationProps],
  });

  return (
    <CalendarGridTimeColumnContext.Provider value={contextValue}>
      {element}
    </CalendarGridTimeColumnContext.Provider>
  );
});

export namespace CalendarGridTimeColumn {
  export interface State {
    /**
     * Whether the column represents the current day.
     */
    current: boolean;
  }

  export interface Props extends BaseUIComponentProps<'div', State>, useTimeDropTarget.Parameters {}
}
