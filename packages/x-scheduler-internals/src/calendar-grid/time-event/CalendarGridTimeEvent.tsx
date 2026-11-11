'use client';
import * as React from 'react';
import { useButton } from '@base-ui/react/internals/use-button';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps, NonNativeButtonProps } from '@base-ui/react/internals/types';
import { schedulerTimeEventMoveKind } from '../../internals/utils/schedulerDrag';
import type { SchedulerAxisEventDragData } from '../../internals/utils/schedulerDrag';
import { SchedulerDraggable } from '../../internals/utils/SchedulerDraggable';
import { CalendarGridTimeEventCssVars } from './CalendarGridTimeEventCssVars';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useDraggableEvent } from '../../internals/utils/useDraggableEvent';
import { computeElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';
import type { useElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';
import { CalendarGridTimeEventContext } from './CalendarGridTimeEventContext';
import type { useOriginalOccurrence } from '../../internals/utils/useOriginalOccurrence';

export const CalendarGridTimeEvent = React.forwardRef(function CalendarGridTimeEvent(
  componentProps: CalendarGridTimeEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Internal props
    start,
    end,
    dataTimezone,
    eventId,
    occurrenceKey,
    renderDragPreview,
    isDraggable = false,
    elementPosition: elementPositionProp,
    nativeButton = false,
    interactive = true,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // Context hooks
  const {
    axis: columnAxis,
    hasFocus: columnHasFocus,
    getCursorPositionInElementMs,
  } = useCalendarGridTimeColumnContext();
  const columnStart = columnAxis.start;

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Feature hooks
  const elementPosition = React.useMemo(
    () =>
      elementPositionProp ??
      computeElementPositionInCollection({ start, end, collection: columnAxis }),
    [columnAxis, elementPositionProp, end, start],
  );
  const { position, duration } = elementPosition;

  const { state, draggableProps, contextValue } = useDraggableEvent({
    kind: schedulerTimeEventMoveKind,
    start,
    end,
    occurrenceKey,
    eventId,
    dataTimezone,
    isDraggable,
    renderDragPreview,
    getExtraDragData: (input) => ({
      initialCursorPositionInEventMs:
        Math.max(columnStart - start.timestamp, 0) +
        getCursorPositionInElementMs({ input, elementRef: ref, elementStart: start.timestamp }),
    }),
    position: elementPosition,
  });

  const { getButtonProps, buttonRef } = useButton({
    disabled: false,
    native: nativeButton,
    tabIndex: columnHasFocus ? 0 : -1,
  });

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [
      elementProps,
      {
        style: {
          [CalendarGridTimeEventCssVars.yPosition]: `${position * 100}%`,
          [CalendarGridTimeEventCssVars.height]: `${duration * 100}%`,
        } as React.CSSProperties,
      },
      ...(interactive ? [getButtonProps] : []),
    ],
  });

  return (
    <CalendarGridTimeEventContext.Provider value={contextValue}>
      <SchedulerDraggable {...draggableProps} render={element} />
    </CalendarGridTimeEventContext.Provider>
  );
});

export namespace CalendarGridTimeEvent {
  export interface State extends useDraggableEvent.State {}

  export interface Props
    extends
      BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      useDraggableEvent.PublicParameters,
      Pick<useOriginalOccurrence.Parameters, 'dataTimezone'> {
    /**
     * Whether the event behaves like a button: `role="button"` and a roving `tabIndex`.
     * Set it to `false` for an inert preview (creation / resize placeholder) that
     * only hosts pointer interactions — it then renders a plain `div`, so it is never focusable.
     * @default true
     */
    interactive?: boolean;
    /**
     * The position of the event in its column, computed from `start` and `end` when not provided.
     */
    elementPosition?: useElementPositionInCollection.ReturnValue;
  }

  export interface DragData extends SchedulerAxisEventDragData {}
}
