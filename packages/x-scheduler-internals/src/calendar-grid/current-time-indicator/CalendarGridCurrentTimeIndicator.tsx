'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useAdapterContext } from '../../use-adapter-context';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';
import { CalendarGridCurrentTimeIndicatorCssVars } from './CalendarGridCurrentTimeIndicatorCssVars';
import { mergeDateAndTime } from '../../internals/utils/date-utils';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { schedulerNowSelectors } from '../../scheduler-selectors';
import { processDate } from '../../process-date';

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

    const { start: columnStart, end: columnEnd } = useCalendarGridTimeColumnContext();
    const store = useEventCalendarStoreContext();
    const now = useStore(store, schedulerNowSelectors.nowUpdatedEveryMinute);

    const nowForColumn = React.useMemo(
      () => processDate(mergeDateAndTime(adapter, columnStart, now), adapter),
      [adapter, columnStart, now],
    );

    const endForCalc = React.useMemo(
      () => processDate(adapter.addMinutes(nowForColumn.value, 1), adapter),
      [adapter, nowForColumn],
    );

    const { position } = useElementPositionInCollection({
      start: nowForColumn,
      end: endForCalc,
      collectionStart: columnStart,
      collectionEnd: columnEnd,
    });

    const isOutOfRange =
      adapter.isBefore(nowForColumn.value, columnStart) ||
      adapter.isAfter(nowForColumn.value, columnEnd);

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
