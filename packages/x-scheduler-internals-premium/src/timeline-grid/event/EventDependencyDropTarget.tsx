'use client';
import { useStore } from '@base-ui/utils/store';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import {
  schedulerDependencyKind,
  schedulerDependencyTargetKind,
} from '@mui/x-scheduler-internals/internals';
import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '../../event-timeline-premium-selectors';

/**
 * Registers an element of an event (its body, or one of its dependency terminals) as
 * a drop target for the create-dependency gesture.
 * Recurring and read-only events register as invalid targets: they never get the drop
 * highlight or the snapped preview, but dropping on one surfaces the rejection instead
 * of dissolving the gesture in silence.
 * Declarative only: the drop itself is finalized by the creation monitor on the grid
 * root, which reads the hovered target from the drop target data.
 */
export function EventDependencyDropTarget(props: EventDependencyDropTarget.Props) {
  const { eventId, occurrenceKey, resourceId, side = 'start', render } = props;

  const store = useEventTimelinePremiumStoreContext();
  const enabled = useStore(store, eventTimelinePremiumDependencySelectors.enabled);
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, eventId);
  const isReadOnly = useStore(store, schedulerEventSelectors.isReadOnly, eventId);

  const payload = React.useMemo(
    () => ({
      dependencyTargetEventId: eventId,
      dependencyTargetOccurrenceKey: occurrenceKey,
      dependencyTargetResourceId: resourceId,
      dependencyTargetSide: side,
      dependencyTargetIsValid: !isRecurring && !isReadOnly,
    }),
    [eventId, occurrenceKey, resourceId, side, isRecurring, isReadOnly],
  );

  return (
    <Draggable.Target
      disabled={!enabled}
      accept={schedulerDependencyKind}
      kind={schedulerDependencyTargetKind}
      payload={payload}
      // Only dependency gestures from this timeline land here; an event cannot depend on itself.
      canDrop={({ source }) =>
        source.payload.storeContext === store && source.payload.eventId !== eventId
      }
      render={render}
    />
  );
}

export namespace EventDependencyDropTarget {
  export interface Props {
    render: React.ReactElement;
    eventId: SchedulerEventId;
    occurrenceKey: string;
    /**
     * The resource of this row appearance, qualifying the occurrence key — an event
     * assigned to several resources repeats the same key on each of its rows.
     */
    resourceId: SchedulerResourceId;
    /**
     * The event edge a drop on this element targets: the event body targets the start
     * edge, the terminals their own edge.
     * @default 'start'
     */
    side?: SchedulerEventSide;
  }
}
