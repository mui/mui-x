'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import { useDragHandle } from '@mui/x-scheduler-internals/internals';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { useEventDependencyDropTarget } from '../event/useEventDependencyDropTarget';
import { TimelineGridEventDependencyTerminalDataAttributes } from './TimelineGridEventDependencyTerminalDataAttributes';
import type { DependencyTerminalDragData } from './dependencyTerminalDragData';

/**
 * The terminal on one edge of an event. Dragging it onto another event (or onto one
 * of its terminals) creates a dependency whose type follows the two edges: the
 * dragged one and the dropped one. It is also a drop target itself, so a gesture can
 * pick the target edge. Positioned by the caller (it does not live inside the event
 * element), which is also responsible for only rendering it when the dependencies
 * feature applies to its event. The drag lifecycle is handled by a global monitor
 * mounted by the grid root (not here) so the gesture survives this element being
 * unmounted by virtualization mid-drag.
 */
export const TimelineGridEventDependencyTerminal = React.forwardRef(
  function TimelineGridEventDependencyTerminal(
    componentProps: TimelineGridEventDependencyTerminal.Props,
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
      source: 'TimelineGridEventDependencyTerminal' as const,
      // Identity discriminator: pragmatic monitors are page-global, so the monitor
      // and the drop targets only react to gestures born in their own timeline.
      storeContext: store,
    }));

    useDragHandle({ ref, enabled: true, getDragData });
    useEventDependencyDropTarget({ ref, eventId, occurrenceKey, resourceId, side });

    return useRenderElement('div', componentProps, {
      ref: [forwardedRef, ref],
      props: [
        elementProps,
        {
          [TimelineGridEventDependencyTerminalDataAttributes.dependencyTerminal]: occurrenceKey,
          [TimelineGridEventDependencyTerminalDataAttributes.resourceId]: String(resourceId),
          [TimelineGridEventDependencyTerminalDataAttributes.side]: side,
        } as Record<string, string>,
      ],
    });
  },
);

export namespace TimelineGridEventDependencyTerminal {
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
     * The event edge the terminal sits on: the predecessor edge a dependency dragged
     * from it starts from, and the successor edge a dependency dropped on it ends on.
     * @default 'end'
     */
    side?: SchedulerEventSide;
  }

  export type DragData = DependencyTerminalDragData;
}
