'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelineStoreContext } from '../../use-timeline-store-context';
import { timelineViewSelectors } from '../../timeline-selectors';
import { TimelineRootCssVars } from './TimelineRootCssVars';

export const TimelineRoot = React.forwardRef(function TimelineRoot(
  componentProps: TimelineRoot.Props,
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
  const store = useTimelineStoreContext();

  // Selector hooks
  const resourcesCount = useStore(store, schedulerResourceSelectors.resourcesCount);
  const viewConfig = useStore(store, timelineViewSelectors.config);

  const props = {
    role: 'grid',
    style: {
      [TimelineRootCssVars.unitCount]: viewConfig.unitCount,
      [TimelineRootCssVars.rowCount]: resourcesCount,
    } as React.CSSProperties,
  };

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace TimelineRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
