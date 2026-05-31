'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
import { useAdapterContext } from '@mui/x-scheduler-internals/use-adapter-context';
import { useElementPositionInCollection } from '@mui/x-scheduler-internals/internals';
import { schedulerNowSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { processDate } from '@mui/x-scheduler-internals/process-date';
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
    const now = useStore(store, schedulerNowSelectors.nowUpdatedEveryMinute);
    const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);

    const processedNow = React.useMemo(() => processDate(now, adapter), [adapter, now]);

    const endForCalc = React.useMemo(
      () => processDate(adapter.addMinutes(now, 1), adapter),
      [adapter, now],
    );

    const { position } = useElementPositionInCollection({
      start: processedNow,
      end: endForCalc,
      collectionStart: presetConfig.start,
      collectionEnd: presetConfig.end,
    });

    const isOutOfRange =
      adapter.isBefore(now, presetConfig.start) || adapter.isAfter(now, presetConfig.end);

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
