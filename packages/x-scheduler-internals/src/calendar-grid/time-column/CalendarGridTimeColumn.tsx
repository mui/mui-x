'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useCompositeListItem } from '@base-ui/react/internals/composite';
import { useDirection } from '@base-ui/react/direction-provider';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import type { SchedulerEvent } from '../../models';
import { schedulerNowSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { EVENT_CREATION_PRECISION_MINUTE } from '../../constants';
import {
  floorToWallClockMinutes,
  toEpochMs,
} from '../../internals/utils/plain-date-utils/timeZone';
import {
  FULL_DAY_MINUTES,
  getPlainDateTimelineAxis,
  resolveRepeatedTimeFrom,
} from '../../internals/utils/timeline-axis';
import type { BaseTemporal } from '../../internals/utils/base-temporal';
import { getDayNumber } from '../../internals/utils/plain-date-utils/plainDate';
import { useEventCreation } from '../../internals/utils/useEventCreation';
import { useKeyboardEventCreation } from '../../internals/utils/useKeyboardEventCreation';
import { getNavigationTarget } from '../../internals/utils/getNavigationTarget';
import { useCalendarGridCellsRefsContext } from '../../internals/utils/CalendarGridCellsRefsContext';
import { useCalendarGridRootContext } from '../root/CalendarGridRootContext';
import { CalendarGridTimeColumnContext } from './CalendarGridTimeColumnContext';
import { getTimeColumnTimestampAt, TimeColumnDropTarget } from './TimeColumnDropTarget';

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
    value,
    dayStartMinute = 0,
    dayEndMinute = FULL_DAY_MINUTES,
    addPropertiesToDroppedEvent,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const store = useEventCalendarStoreContext();
  const { focusedCell, setFocusedCell, rowTypes, rowsPerType } = useCalendarGridRootContext();
  const isRtl = useDirection() === 'rtl';
  const isCurrentDay = useStore(store, schedulerNowSelectors.nowDayNumber) === getDayNumber(value);
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const { ref: listItemRef, index } = useCompositeListItem();
  const cellsRefs = useCalendarGridCellsRefsContext();

  const cellRef = React.useRef<HTMLDivElement>(null);
  const hasFocus =
    focusedCell?.rowType === 'time-grid' &&
    focusedCell?.rowIndex === 0 &&
    focusedCell?.columnIndex === index;

  const axis = React.useMemo(
    () => getPlainDateTimelineAxis(value, { dayStartMinute, dayEndMinute }, displayTimezone),
    [value, displayTimezone, dayStartMinute, dayEndMinute],
  );
  const { start, end } = axis;

  const getCursorPositionInElementMs: CalendarGridTimeColumnContext['getCursorPositionInElementMs'] =
    useStableCallback(({ input, elementRef, elementStart }) => {
      if (!cellRef.current || !elementRef.current) {
        return 0;
      }

      // The column renders a wall-clock axis, which keeps every hour on DST days. Reading the
      // dates under the element top and under the cursor on that axis keeps the offset in sync
      // with the rendered grid. The offset is the time elapsed between them.
      const column = cellRef.current;
      const columnTop = column.getBoundingClientRect().y;
      const getTimestampAtClientY = (clientY: number) =>
        getTimeColumnTimestampAt(axis, (clientY - columnTop) / column.offsetHeight);
      const elementTop = Math.max(elementRef.current.getBoundingClientRect().y, columnTop);
      const cursorY = Math.max(input.clientY, elementTop);

      let cursorTimestamp = getTimestampAtClientY(cursorY);
      let topTimestamp = getTimestampAtClientY(elementTop);
      // On a fall-back day, the axis reads the top of an element starting in the second occurrence
      // of the repeated hour, and the cursor inside that hour, as their first occurrence.
      if (elementStart != null) {
        const startTimestamp = Math.max(elementStart, start);
        cursorTimestamp = resolveRepeatedTimeFrom(cursorTimestamp, startTimestamp, displayTimezone);
        topTimestamp = resolveRepeatedTimeFrom(topTimestamp, startTimestamp, displayTimezone);
      }
      return cursorTimestamp - topTimestamp;
    });

  const eventCreationProps = useEventCreation(({ event, creationConfig, timezone }) => {
    const offsetMs = getCursorPositionInElementMs({
      input: { clientY: event.clientY },
      elementRef: cellRef,
    });
    const startTimestamp = floorToWallClockMinutes(
      start + offsetMs,
      EVENT_CREATION_PRECISION_MINUTE,
      timezone,
    );
    return {
      surfaceType: 'time-grid' as const,
      start: startTimestamp,
      end: startTimestamp + creationConfig.duration * 60_000,
      resourceId: null,
    };
  });

  const triggerKeyboardCreation = useKeyboardEventCreation(({ creationConfig, timezone }) => {
    const noon = toEpochMs(value, 12 * 60 * 60_000, timezone);
    // Keep the default creation anchor inside the visible window when the view limits its hour range.
    const anchor = noon < start || noon >= end ? start : noon;
    return {
      surfaceType: 'time-grid' as const,
      start: anchor,
      end: anchor + creationConfig.duration * 60_000,
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
      setFocusedCell({ rowType: 'time-grid', rowIndex: 0, columnIndex: index });
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
      plainDate: value,
      axis,
      hasFocus,
      getCursorPositionInElementMs,
    }),
    [value, axis, hasFocus, getCursorPositionInElementMs],
  );

  const keyboardProps = {
    tabIndex: 0,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, listItemRef, cellRef],
    props: [
      { role: 'gridcell', 'aria-colindex': index + 1 },
      keyboardProps,
      eventCreationProps,
      elementProps,
    ],
  });

  return (
    <CalendarGridTimeColumnContext.Provider value={contextValue}>
      <TimeColumnDropTarget
        addPropertiesToDroppedEvent={addPropertiesToDroppedEvent}
        render={element}
      />
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

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The date of the column, in the display timezone.
     * Keep its identity stable: the column rebuilds its axis and its context when it changes.
     */
    value: BaseTemporal.PlainDate;
    /**
     * First displayed minute of the day, as an offset from midnight.
     * Derived from the view's whole-hour window so it stays aligned with the
     * grid rows even on DST-transition days.
     * @default 0
     */
    dayStartMinute?: number;
    /**
     * End of the displayed window of the day, as an exclusive offset from midnight (1440 for the full day).
     * Derived from the view's whole-hour window so it stays aligned with the
     * grid rows even on DST-transition days.
     * @default 1440
     */
    dayEndMinute?: number;
    /**
     * Add properties to the event dropped in the column before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }
}
