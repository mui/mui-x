'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { SchedulerDraggable } from '../../internals/utils/SchedulerDraggable';
import { useEventResizeHandler } from '../../internals/utils/useEventResizeHandler';
import { isResizeHandlerEnabled } from '../../internals/utils/resize-utils';
import { useCalendarGridDayEventContext } from '../day-event/CalendarGridDayEventContext';
import type { CalendarGridDayEvent } from '../day-event/CalendarGridDayEvent';
import type { SchedulerEventSide } from '../../models';

export const CalendarGridDayEventResizeHandler = React.forwardRef(
  function CalendarGridDayEventResizeHandler(
    componentProps: CalendarGridDayEventResizeHandler.Props,
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
    const contextValue = useCalendarGridDayEventContext();

    // Ref hooks
    const ref = React.useRef<HTMLDivElement>(null);

    // Feature hooks
    const getDragData = useStableCallback((input) => ({
      ...contextValue.getSharedDragData(input),
      source: 'CalendarGridDayEventResizeHandler' as const,
      side,
    }));

    const enabled = isResizeHandlerEnabled({
      side,
      isEventStartClipped: contextValue.isEventStartClipped,
      isEventEndClipped: contextValue.isEventEndClipped,
    });

    const { state, draggableProps } = useEventResizeHandler({
      source: 'CalendarGridDayEventResizeHandler',
      eventId: contextValue.eventId,
      occurrenceKey: contextValue.occurrenceKey,
      ref,
      side,
      enabled,
      getDragData,
    });

    const element = useRenderElement('div', componentProps, {
      enabled,
      state,
      ref: [forwardedRef, ref],
      props: [elementProps],
    });

    return element && <SchedulerDraggable {...draggableProps} render={element} />;
  },
);

export namespace CalendarGridDayEventResizeHandler {
  export interface State extends useEventResizeHandler.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useEventResizeHandler.PublicParameters {}

  export interface DragData extends CalendarGridDayEvent.SharedDragData {
    source: 'CalendarGridDayEventResizeHandler';
    side: SchedulerEventSide;
  }
}
