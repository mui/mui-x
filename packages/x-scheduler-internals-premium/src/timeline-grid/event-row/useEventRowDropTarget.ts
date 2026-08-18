'use client';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerResourceId, SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { useLinearTimeDropTarget } from '@mui/x-scheduler-internals/internals';
import type { TimelineGridEventRowContext } from './TimelineGridEventRowContext';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumPresetSelectors } from '../../event-timeline-premium-selectors';

const sources = {
  move: 'TimelineGridEvent',
  resize: 'TimelineGridEventResizeHandler',
  external: 'StandaloneEvent',
} as const;

export function useEventRowDropTarget(parameters: useEventRowDropTarget.Parameters) {
  const { resourceId, addPropertiesToDroppedEvent } = parameters;
  const store = useEventTimelinePremiumStoreContext();
  const config = useStore(store, eventTimelinePremiumPresetSelectors.config);

  return useLinearTimeDropTarget({
    axis: 'horizontal',
    timeScale: { type: 'timeline-axis', axis: config },
    constrainEventToTimeAxis: false,
    externalDropStart: 'last-slot',
    sources,
    surfaceType: 'timeline',
    resourceId,
    addPropertiesToDroppedEvent,
  });
}

export namespace useEventRowDropTarget {
  export interface Parameters {
    /**
     * The id of the resource to drop the event onto.
     */
    resourceId: SchedulerResourceId;
    /**
     * Add properties to the event dropped in the row before storing it in the store.
     */
    addPropertiesToDroppedEvent?: () => Partial<SchedulerEvent>;
  }

  export interface ReturnValue extends Pick<
    TimelineGridEventRowContext,
    'getCursorPositionInElementMs'
  > {}
}
