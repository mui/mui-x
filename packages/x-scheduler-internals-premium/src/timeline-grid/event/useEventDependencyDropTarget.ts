'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors';

/**
 * Registers the event element as a drop target for the create-dependency gesture.
 * Recurring and read-only events register as invalid targets: they never get the drop
 * highlight or the snapped preview, but dropping on one surfaces the rejection instead
 * of dissolving the gesture in silence.
 * Declarative only: the drop itself is finalized by the creation monitor on the grid
 * root, which reads the hovered target from the drop target data.
 */
export function useEventDependencyDropTarget(parameters: useEventDependencyDropTarget.Parameters) {
  const { ref, eventId, occurrenceKey } = parameters;

  const store = useEventTimelinePremiumStoreContext();
  const enabled = useStore(store, eventTimelinePremiumDependencySelectors.enabled);
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, eventId);
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, eventId);

  React.useEffect(() => {
    if (!ref.current || !enabled) {
      return undefined;
    }

    return dropTargetForElements({
      element: ref.current,
      getData: () => ({
        dependencyTargetEventId: eventId,
        dependencyTargetOccurrenceKey: occurrenceKey,
        dependencyTargetIsValid: !isRecurring && !isReadOnly,
      }),
      // Only the dependency gesture of this timeline lands here (rows keep handling
      // the event drags — their allowlist ignores this source, and gestures born in
      // another timeline on the page carry a different store), and an event cannot
      // depend on itself.
      canDrop: ({ source }) =>
        source.data.source === 'TimelineGridEventDependencyHandle' &&
        source.data.storeContext === store &&
        source.data.eventId !== eventId,
    });
  }, [ref, store, enabled, isRecurring, isReadOnly, eventId, occurrenceKey]);
}

export namespace useEventDependencyDropTarget {
  export interface Parameters {
    /**
     * The ref to the event's root element.
     */
    ref: React.RefObject<HTMLDivElement | null>;
    eventId: SchedulerEventId;
    occurrenceKey: string;
  }
}
