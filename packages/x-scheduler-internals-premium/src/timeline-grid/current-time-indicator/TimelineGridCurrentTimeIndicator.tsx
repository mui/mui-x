'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import {
  createProcessedDate,
  useElementPositionInCollection,
  isStartMinuteOutsideAxisWindow,
} from '@mui/x-scheduler-internals/internals';
import {
  schedulerNowSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import { TimelineGridCurrentTimeIndicatorCssVars } from './TimelineGridCurrentTimeIndicatorCssVars';

export const TimelineGridCurrentTimeIndicator = React.forwardRef(
  function TimelineGridCurrentTimeIndicator(
    componentProps: TimelineGridCurrentTimeIndicator.Props,
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

    const store = useEventTimelinePremiumStoreContext();
    const nowTimestamp = useStore(store, schedulerNowSelectors.nowTimestamp);
    const displayTimezone = useStore(store, schedulerOtherSelectors.displayTimezone);
    const config = useStore(store, eventTimelinePremiumPresetSelectors.config);

    const processedNow = React.useMemo(
      () => createProcessedDate(adapter, nowTimestamp, displayTimezone),
      [adapter, nowTimestamp, displayTimezone],
    );

    const { position } = useElementPositionInCollection({
      // Only the position is read, which depends on the start alone.
      start: processedNow,
      end: processedNow,
      collection: config,
      durationMs: config.durationMs,
    });

    const isOutOfRange =
      nowTimestamp < adapter.getTime(config.start) ||
      nowTimestamp > adapter.getTime(config.end) ||
      isStartMinuteOutsideAxisWindow(config, processedNow.minutesInDay);

    return useRenderElement('div', componentProps, {
      ref: [forwardedRef],
      props: [
        elementProps,
        {
          style: {
            [TimelineGridCurrentTimeIndicatorCssVars.xPosition]: position,
          } as React.CSSProperties,
        },
      ],
      enabled: !isOutOfRange,
    });
  },
);

export namespace TimelineGridCurrentTimeIndicator {
  export interface State {}
  export interface Props extends BaseUIComponentProps<'div', State> {}
}
