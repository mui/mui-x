'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import type { SchedulerEventId } from '@mui/x-scheduler-internals/models';
import type { BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';
import { useRenderElement } from '@mui/x-scheduler-internals/base-ui-copy';

/**
 * The terminal on the end edge of an event: dragging it onto another event creates a
 * `FinishToStart` dependency. Positioned by the caller (it does not live inside the
 * event element), which is also responsible for only rendering it when the
 * dependencies feature applies to its event. The drag lifecycle is handled by a global
 * monitor mounted by the grid root (not here) so the gesture survives this element
 * being unmounted by virtualization mid-drag.
 */
export const TimelineGridEventDependencyHandle = React.forwardRef(
  function TimelineGridEventDependencyHandle(
    componentProps: TimelineGridEventDependencyHandle.Props,
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
      // Props forwarded to the DOM element
      ...elementProps
    } = componentProps;

    // Ref hooks
    const ref = React.useRef<HTMLDivElement>(null);

    // Feature hooks
    const getDragData = useStableCallback(() => ({
      eventId,
      occurrenceKey,
      source: 'TimelineGridEventDependencyHandle' as const,
    }));

    React.useEffect(() => {
      if (!ref.current) {
        return undefined;
      }

      return draggable({
        element: ref.current,
        getInitialData: () => getDragData(),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          disableNativeDragPreview({ nativeSetDragImage });
        },
      });
    }, [getDragData]);

    return useRenderElement('div', componentProps, {
      ref: [forwardedRef, ref],
      // The occurrence key as the attribute value lets hover tracking recognize the
      // terminal as part of its event.
      props: [elementProps, { 'data-dependency-handle': occurrenceKey } as Record<string, string>],
    });
  },
);

export namespace TimelineGridEventDependencyHandle {
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
  }

  export interface DragData {
    eventId: SchedulerEventId;
    occurrenceKey: string;
    source: 'TimelineGridEventDependencyHandle';
  }
}
