'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumViewSelectors } from '../../event-timeline-premium-selectors';
import { EventTimelinePremiumRootCssVars } from './EventTimelinePremiumRootCssVars';

export const EventTimelinePremiumRoot = React.forwardRef(function EventTimelinePremiumRoot(
  componentProps: EventTimelinePremiumRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const store = useEventTimelinePremiumStoreContext();

  // Selector hooks
  const resourcesCount = useStore(store, schedulerResourceSelectors.resourcesCount);
  const viewConfig = useStore(store, eventTimelinePremiumViewSelectors.config);

  const props = {
    role: 'grid',
    style: {
      [EventTimelinePremiumRootCssVars.unitCount]: viewConfig.unitCount,
      [EventTimelinePremiumRootCssVars.rowCount]: resourcesCount,
    } as React.CSSProperties,
  };

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace EventTimelinePremiumRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
