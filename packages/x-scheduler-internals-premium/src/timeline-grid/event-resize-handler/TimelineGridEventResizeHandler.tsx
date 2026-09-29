'use client';
import {
  SchedulerDraggable,
  useEventResizeHandler,
  isResizeHandlerEnabled,
} from '@mui/x-scheduler-internals/internals';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { SchedulerEventSide } from '@mui/x-scheduler-internals/models';
import { useTimelineGridEventContext } from '../event/TimelineGridEventContext';
import type { TimelineGridEvent } from '../event/TimelineGridEvent';
import { schedulerTimelineEventResizeKind } from '../../internals/utils/schedulerTimelineDrag';

export const TimelineGridEventResizeHandler = React.forwardRef(
  function TimelineGridEventResizeHandler(
    componentProps: TimelineGridEventResizeHandler.Props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const {
      // Rendering props
      className,
      render,
      style,
      // Internal props
      side,
      // Props forwarded to the DOM element
      ...elementProps
    } = componentProps;

    // Context hooks
    const contextValue = useTimelineGridEventContext();

    // Feature hooks
    const getDragData = useStableCallback((input) => ({
      ...contextValue.getDragData(input),
      side,
    }));

    const enabled = isResizeHandlerEnabled({
      side,
      isEventStartClipped: contextValue.isEventStartClipped,
      isEventEndClipped: contextValue.isEventEndClipped,
    });

    const { state, draggableProps } = useEventResizeHandler({
      kind: schedulerTimelineEventResizeKind,
      eventId: contextValue.eventId,
      occurrenceKey: contextValue.occurrenceKey,
      side,
      enabled,
      getDragData,
      dragCursor: 'ew-resize',
    });

    const element = useRenderElement('div', componentProps, {
      enabled,
      state,
      ref: forwardedRef,
      props: [elementProps],
    });

    return element && <SchedulerDraggable {...draggableProps} render={element} />;
  },
);

export namespace TimelineGridEventResizeHandler {
  export interface State extends useEventResizeHandler.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useEventResizeHandler.PublicParameters {}

  export interface DragData extends TimelineGridEvent.DragData {
    side: SchedulerEventSide;
  }
}
