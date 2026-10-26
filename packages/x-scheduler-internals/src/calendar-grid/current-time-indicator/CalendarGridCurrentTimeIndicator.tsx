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
    const nowTimestamp = useStore(store, schedulerNowSelectors.nowTimestamp);
    const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

    // The time of day of now, on the wall clock of the day of the column.
    const nowForColumn = React.useMemo(() => {
      const columnPlainDate = toPlainDateTime(adapter.getTime(columnStart), displayTimezone).date;
      const nowMsInDay = toPlainDateTime(nowTimestamp, displayTimezone).msInDay;
      return createProcessedDate(
        adapter,
        toEpochMs(columnPlainDate, nowMsInDay, displayTimezone),
        displayTimezone,
      );
    }, [adapter, columnStart, displayTimezone, nowTimestamp]);

    const { position } = useElementPositionInCollection({
      // Only the position is read, which depends on the start alone.
      start: nowForColumn,
      end: nowForColumn,
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
