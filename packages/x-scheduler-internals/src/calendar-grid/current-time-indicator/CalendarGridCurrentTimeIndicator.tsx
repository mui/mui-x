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
import { moveTimestampToPlainDate } from '../../internals/utils/plain-date-utils/timeZone';

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

    const { axis: columnAxis, plainDate: columnPlainDate } = useCalendarGridTimeColumnContext();
    const { start: columnStart, end: columnEnd } = columnAxis;
    const store = useEventCalendarStoreContext();
    const nowTimestamp = useStore(store, schedulerNowSelectors.nowTimestamp);
    const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);

    // The time of day of now, on the wall clock of the day of the column.
    const nowForColumn = React.useMemo(
      () =>
        createProcessedDate(
          adapter,
          moveTimestampToPlainDate(nowTimestamp, columnPlainDate, displayTimezone),
          displayTimezone,
        ),
      [adapter, columnPlainDate, displayTimezone, nowTimestamp],
    );

    const { position } = useElementPositionInCollection({
      // Only the position is read, which depends on the start alone.
      start: nowForColumn,
      end: nowForColumn,
      collection: columnAxis,
    });

    const isOutOfRange = nowForColumn.timestamp < columnStart || nowForColumn.timestamp > columnEnd;

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
