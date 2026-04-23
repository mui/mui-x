'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import {
  useRenderElement,
  BaseUIComponentProps,
  CompositeList,
} from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';
import { TimelineGridSubGridContext } from './TimelineGridSubGridContext';

export const TimelineGridSubGrid = React.forwardRef(function TimelineGridSubGrid(
  componentProps: TimelineGridSubGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    children: childrenProp,
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

  const children = React.useMemo(() => {
    if (!React.isValidElement(childrenProp) && typeof childrenProp === 'function') {
      return resources.map(({ resource }) => childrenProp(resource.id));
    }

    return childrenProp;
  }, [childrenProp, resources]);

  const rowsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [elementProps, { role: 'rowgroup', children }],
  });

  return (
    <TimelineGridSubGridContext.Provider value>
      <CompositeList elementsRef={rowsRef}>{element}</CompositeList>
    </TimelineGridSubGridContext.Provider>
  );
});

export namespace TimelineGridSubGrid {
  export interface State {}

  export interface Props extends Omit<BaseUIComponentProps<'div', State>, 'children'> {
    children?: React.ReactNode | ((resourceId: SchedulerResourceId) => React.ReactNode);
  }
}
