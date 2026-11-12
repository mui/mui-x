'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import { CompositeList } from '@base-ui/react/internals/composite';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { CalendarGridDayRowContext } from './CalendarGridDayRowContext';
import { CalendarGridCellsRefsContext } from '../../internals/utils/CalendarGridCellsRefsContext';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { schedulerOtherSelectors } from '../../scheduler-selectors';
import { FULL_DAY_MINUTES } from '../../internals/utils/timeline-axis';
import { getDayNumber } from '../../internals/utils/plain-date-utils/plainDate';
import type { SchedulerProcessedDay } from '../../models';

export const CalendarGridDayRow = React.forwardRef(function CalendarGridDayRow(
  componentProps: CalendarGridDayRow.Props,
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
    days,
    rowIndex = 0,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const store = useEventCalendarStoreContext();
  const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
  const cellsRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const dayNumbers = React.useMemo(() => days.map((day) => getDayNumber(day.plainDate)), [days]);

  const contextValue: CalendarGridDayRowContext = React.useMemo(
    () => ({
      // The row spans whole days, so its window is never trimmed.
      axis: {
        start,
        end,
        timezone: displayTimezone,
        dayStartMinute: 0,
        dayEndMinute: FULL_DAY_MINUTES,
      },
      rowIndex,
      dayNumbers,
    }),
    [start, end, displayTimezone, rowIndex, dayNumbers],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [{ role: 'row', 'aria-rowindex': rowIndex + 2 }, elementProps],
  });

  return (
    <CompositeList elementsRef={cellsRefs}>
      <CalendarGridCellsRefsContext.Provider value={cellsRefs}>
        <CalendarGridDayRowContext.Provider value={contextValue}>
          {element}
        </CalendarGridDayRowContext.Provider>
      </CalendarGridCellsRefsContext.Provider>
    </CompositeList>
  );
});

export namespace CalendarGridDayRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The first instant of the row, as a timestamp read in the display timezone.
     */
    start: number;
    /**
     * The last instant of the row, as a timestamp read in the display timezone.
     */
    end: number;
    /**
     * The days of the cells of the row, in their order.
     * A row can skip dates (hidden weekends, days a timezone skips), so its cells are not every date
     * between `start` and `end`.
     */
    days: readonly Pick<SchedulerProcessedDay, 'plainDate'>[];
    /**
     * The index of this row within its row type.
     * Used to uniquely identify the row for keyboard navigation when there are
     * multiple rows of the same type (e.g., multiple weeks in the month view).
     * @default 0
     */
    rowIndex?: number;
  }
}
