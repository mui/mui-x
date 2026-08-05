'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import { useDragHandle } from '@mui/x-scheduler-internals/internals';
import { buildIsValidDropTarget } from '@mui/x-scheduler-internals/build-is-valid-drop-target';
import type { BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
import { useRenderElement } from '@mui/x-scheduler-internals/base-ui-copy';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { TimelineGridEventDependencyHandlerDataAttributes } from './TimelineGridEventDependencyHandlerDataAttributes';

/**
 * Narrows a drag payload to this handle's drag data — the one definition shared by
 * the creation monitor and the event drop targets.
 */
export const isDependencyHandleDrag = buildIsValidDropTarget([
  'TimelineGridEventDependencyHandler',
]);

/**
 * The terminal on the end edge of an event: dragging it onto another event creates a
 * `FinishToStart` dependency. Positioned by the caller (it does not live inside the
 * event element), which is also responsible for only rendering it when the
 * dependencies feature applies to its event. The drag lifecycle is handled by a global
 * monitor mounted by the grid root (not here) so the gesture survives this element
 * being unmounted by virtualization mid-drag.
 */
export const TimelineGridEventDependencyHandler = React.forwardRef(
  function TimelineGridEventDependencyHandler(
    componentProps: TimelineGridEventDependencyHandler.Props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      // Rendering props
      className,
      render,
      style,
      // Parameters
      eventId,
      occurrenceKey,
      resourceId,
      side = 'end',
      // Props forwarded to the DOM element
      ...elementProps
    } = componentProps;

    // Context hooks
    const store = useEventTimelinePremiumStoreContext();

    // Ref hooks
    const ref = React.useRef<HTMLDivElement>(null);

    // Feature hooks
    const getDragData = useStableCallback(() => ({
      eventId,
      occurrenceKey,
      resourceId,
      sourceSide: side,
      source: 'TimelineGridEventDependencyHandler' as const,
      // Identity discriminator: pragmatic monitors are page-global, so the monitor
      // and the drop targets only react to gestures born in their own timeline.
      storeContext: store as unknown,
    }));

    useDragHandle({ ref, enabled: true, getDragData });

    return useRenderElement('div', componentProps, {
      ref: [forwardedRef, ref],
      props: [
        elementProps,
        {
          [TimelineGridEventDependencyHandlerDataAttributes.dependencyHandle]: occurrenceKey,
          [TimelineGridEventDependencyHandlerDataAttributes.resourceId]: String(resourceId),
        } as Record<string, string>,
      ],
    });
  },
);

export namespace TimelineGridEventDependencyHandler {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The event the terminal belongs to.
     */
    eventId: SchedulerEventId;
    /**
     * The row appearance of the event the terminal is anchored on.
     */
    occurrenceKey: string;
    /**
     * The resource of the row appearance. Qualifies the occurrence key, which an
     * event assigned to several resources repeats on each of its rows.
     */
    resourceId: SchedulerResourceId;
    /**
     * The event edge the terminal sits on — the edge of the predecessor the created
     * dependency starts from. Only `'end'` is exercised while `FinishToStart` is the
     * only dependency type; the start-edge terminals arrive with the other types.
     * @default 'end'
     */
    side?: SchedulerEventSide;
  }

  export interface DragData {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    /**
     * The resource of the row appearance the gesture started from.
     */
    resourceId: SchedulerResourceId;
    /**
     * The edge of the source event the gesture started from. Combined with the drop
     * edge, it determines the created dependency's type.
     */
    sourceSide: SchedulerEventSide;
    source: 'TimelineGridEventDependencyHandler';
    /**
     * The store of the timeline the gesture started in, compared by identity so
     * several timelines on one page don't react to each other's gestures.
     */
    storeContext: unknown;
  }
}
