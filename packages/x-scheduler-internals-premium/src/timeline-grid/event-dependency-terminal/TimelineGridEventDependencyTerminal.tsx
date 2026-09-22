'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import type {
  SchedulerEventId,
  SchedulerEventSide,
  SchedulerResourceId,
} from '@mui/x-scheduler-internals/models';
import { schedulerDependencyKind } from '@mui/x-scheduler-internals/internals';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import { useEventTimelinePremiumStoreContext } from '../../use-event-timeline-premium-store-context';
import { EventDependencyDropTarget } from '../event/EventDependencyDropTarget';
import { TimelineGridEventDependencyTerminalDataAttributes } from './TimelineGridEventDependencyTerminalDataAttributes';

/**
 * The terminal on one edge of an event: dragging it onto another event or terminal
 * creates a dependency whose type follows the two edges. It is a drop target too, so
 * a gesture can pick the target edge. Positioned by the caller, which only renders it
 * when the feature applies to its event. The drag lifecycle lives in the grid root's
 * monitor, so the gesture survives this element being unmounted mid-drag.
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
    const payload = React.useMemo(
      () => ({
        eventId,
        occurrenceKey,
        resourceId,
        sourceSide: side,
        // Identity discriminator: Base UI monitors are page-global, so the monitor
        // and the drop targets only react to gestures born in their own timeline.
        storeContext: store,
      }),
      [eventId, occurrenceKey, resourceId, side, store],
    );

    const element = useRenderElement('div', componentProps, {
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

    return (
      <EventDependencyDropTarget
        eventId={eventId}
        occurrenceKey={occurrenceKey}
        resourceId={resourceId}
        side={side}
        render={
          <Draggable.Root
            kind={schedulerDependencyKind}
            payload={payload}
            render={
              React.isValidElement<{ children?: React.ReactNode }>(element)
                ? React.cloneElement(element, {
                    children: (
                      <React.Fragment>
                        {element.props.children}
                        <Draggable.Preview disabled />
                      </React.Fragment>
                    ),
                  })
                : element
            }
          />
        }
      />
    );
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
}
