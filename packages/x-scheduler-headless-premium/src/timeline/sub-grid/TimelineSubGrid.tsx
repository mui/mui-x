'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { schedulerOccurrenceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { useTimelineStoreContext } from '../../use-timeline-store-context';
import { timelineViewSelectors } from '../../timeline-selectors';

export const TimelineSubGrid = React.forwardRef(function TimelineSubGrid(
  componentProps: TimelineSubGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    children: childrenProp,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const store = useTimelineStoreContext();

  // Selector hooks
  const viewConfig = useStore(store, timelineViewSelectors.config);
  const resources = useStore(
    store,
    schedulerOccurrenceSelectors.groupedByResourceList,
    viewConfig.start,
    viewConfig.end,
  );

  const children = React.useMemo(() => {
    if (!React.isValidElement(childrenProp) && typeof childrenProp === 'function') {
      return resources.map(({ resource }) => childrenProp(resource.id));
    }

    return childrenProp;
  }, [childrenProp, resources]);

  const props = { role: 'rowgroup', children };

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace TimelineSubGrid {
  export interface State {}

  export interface Props extends Omit<BaseUIComponentProps<'div', State>, 'children'> {
    children?: React.ReactNode | ((resourceId: SchedulerResourceId) => React.ReactNode);
  }
}
