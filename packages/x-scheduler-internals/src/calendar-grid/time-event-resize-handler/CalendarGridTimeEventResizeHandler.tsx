'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps } from '@base-ui/react/internals/types';
import { schedulerTimeEventResizeKind } from '../../internals/utils/schedulerDrag';
import { SchedulerDraggable } from '../../internals/utils/SchedulerDraggable';
import { useEventResizeHandler } from '../../internals/utils/useEventResizeHandler';
import { useCalendarGridTimeEventContext } from '../time-event/CalendarGridTimeEventContext';
import type { CalendarGridTimeEvent } from '../time-event/CalendarGridTimeEvent';
import type { SchedulerEventSide } from '../../models';

// A finger or pen resizes from the first contact instead of after a hold, since the handle is
// the only thing under it. The date depends on the vertical position only, so the drag stays
// on the column it started in however far the pointer drifts sideways.
const TOUCH_AND_PEN_ACTIVATION = {
  touch: { type: 'immediate' },
  pen: { type: 'immediate' },
} as const;

export const CalendarGridTimeEventResizeHandler = React.forwardRef(
  function CalendarGridTimeEventResizeHandler(
    componentProps: CalendarGridTimeEventResizeHandler.Props,
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
    const contextValue = useCalendarGridTimeEventContext();

    const { state, enabled, draggableProps } = useEventResizeHandler({
      context: contextValue,
      getEventDragData: contextValue.getDragData,
      kind: schedulerTimeEventResizeKind,
      side,
      activation: TOUCH_AND_PEN_ACTIVATION,
      modifiers: Draggable.restrictToVerticalAxis,
      dragCursor: 'ns-resize',
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

export namespace CalendarGridTimeEventResizeHandler {
  export interface State extends useEventResizeHandler.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useEventResizeHandler.PublicParameters {}

  export interface DragData extends CalendarGridTimeEvent.DragData {
    side: SchedulerEventSide;
  }
}
