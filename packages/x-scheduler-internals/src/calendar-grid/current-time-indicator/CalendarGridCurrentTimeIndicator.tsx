'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useAdapterContext } from '../../use-adapter-context';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';
import { CalendarGridCurrentTimeIndicatorCssVars } from './CalendarGridCurrentTimeIndicatorCssVars';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { schedulerNowSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { createProcessedDate } from '../../internals/utils/plain-date-utils/adapter';
import { toEpochMs, toPlainDateTime } from '../../internals/utils/plain-date-utils/timeZone';

export const CalendarGridCurrentTimeIndicator = React.forwardRef(
  function CalendarGridCurrentTimeIndicator(
    componentProps: CalendarGridCurrentTimeIndicator.Props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const adapter = useAdapterContext();

    const {
      // Rendering props
      className,
      render,
      style,
      // Props forwarded to the DOM element
      ...elementProps
    } = componentProps;

    const {
      start: columnStart,
      end: columnEnd,
      dayStartMinute,
      dayEndMinute,
    } = useCalendarGridTimeColumnContext();
    const store = useEventCalendarStoreContext();
    const now = useStore(store, schedulerNowSelectors.nowUpdatedEveryMinute);
    const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

    // The time of day of now, on the wall clock of the day of the column.
    const { nowForColumn, endForCalc } = React.useMemo(() => {
      const columnPlainDate = toPlainDateTime(adapter.getTime(columnStart), displayTimezone).date;
      const nowMsInDay = toPlainDateTime(adapter.getTime(now), displayTimezone).msInDay;
      const timestamp = toEpochMs(columnPlainDate, nowMsInDay, displayTimezone);
      return {
        nowForColumn: createProcessedDate(adapter, timestamp, displayTimezone),
        endForCalc: createProcessedDate(adapter, timestamp + 60_000, displayTimezone),
      };
    }, [adapter, columnStart, displayTimezone, now]);

    const { position } = useElementPositionInCollection({
      start: nowForColumn,
      end: endForCalc,
      collection: { start: columnStart, end: columnEnd, dayStartMinute, dayEndMinute },
    });

    const isOutOfRange =
      nowForColumn.timestamp < adapter.getTime(columnStart) ||
      nowForColumn.timestamp > adapter.getTime(columnEnd);

    return useRenderElement('div', componentProps, {
      ref: [forwardedRef],
      props: [
        elementProps,
        {
          style: {
            [CalendarGridCurrentTimeIndicatorCssVars.yPosition]: `${position * 100}%`,
          } as React.CSSProperties,
        },
      ],
      enabled: !isOutOfRange,
    });
  },
);

export namespace CalendarGridCurrentTimeIndicator {
  export interface State {}
  export interface Props extends BaseUIComponentProps<'div', State> {}
}
