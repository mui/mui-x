'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import { TimelineGridRootCssVars } from './TimelineGridRootCssVars';

export const TimelineGridRoot = React.forwardRef(function TimelineGridRoot(
  componentProps: TimelineGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();

  // Selector hooks
  const presetConfig = useStore(store, eventTimelinePremiumPresetSelectors.config);
  const resources = useStore(
    store,
    schedulerOccurrenceSelectors.groupedByResourceList,
    presetConfig.start,
    presetConfig.end,
  );

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [
      elementProps,
      {
        role: 'grid',
        style: {
          [TimelineGridRootCssVars.unitCount]: presetConfig.unitCount,
          [TimelineGridRootCssVars.rowCount]: resources.length,
        } as React.CSSProperties,
      },
    ],
  });
});

export namespace TimelineGridRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
