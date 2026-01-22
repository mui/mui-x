'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useTimelinePremiumStoreContext } from '../../use-timeline-premium-store-context';
import { timelinePremiumViewSelectors } from '../../timeline-premium-selectors';
import { TimelinePremiumRootCssVars } from './TimelinePremiumRootCssVars';

export const TimelinePremiumRoot = React.forwardRef(function TimelinePremiumRoot(
  componentProps: TimelinePremiumRoot.Props,
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
  const store = useTimelinePremiumStoreContext();

  // Selector hooks
  const resourcesCount = useStore(store, schedulerResourceSelectors.resourcesCount);
  const viewConfig = useStore(store, timelinePremiumViewSelectors.config);

  const props = {
    role: 'grid',
    style: {
      [TimelinePremiumRootCssVars.unitCount]: viewConfig.unitCount,
      [TimelinePremiumRootCssVars.rowCount]: resourcesCount,
    } as React.CSSProperties,
  };

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace TimelinePremiumRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
