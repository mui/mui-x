'use client';
import * as React from 'react';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { schedulerDayEventResizeKind } from '../../internals/utils/schedulerDrag';
import { SchedulerDraggable } from '../../internals/utils/SchedulerDraggable';
import { useEventResizeHandler } from '../../internals/utils/useEventResizeHandler';
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

    const { state, enabled, draggableProps } = useEventResizeHandler({
      context: contextValue,
      getEventDragData: contextValue.getSharedDragData,
      kind: schedulerDayEventResizeKind,
      side,
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

export namespace CalendarGridDayEventResizeHandler {
  export interface State extends useEventResizeHandler.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useEventResizeHandler.PublicParameters {}

  export interface DragData extends CalendarGridDayEvent.SharedDragData {
    side: SchedulerEventSide;
  }
}
