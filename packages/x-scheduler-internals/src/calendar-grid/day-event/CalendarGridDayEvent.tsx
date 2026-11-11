'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useDirection } from '@base-ui/react/direction-provider';
import { useButton } from '@base-ui/react/internals/use-button';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps, NonNativeButtonProps } from '@base-ui/react/internals/types';
import { schedulerDayEventMoveKind } from '../../internals/utils/schedulerDrag';
import type { SchedulerEventDragData } from '../../internals/utils/schedulerDrag';
import { SchedulerDraggable } from '../../internals/utils/SchedulerDraggable';
import { useDraggableEvent } from '../../internals/utils/useDraggableEvent';
import { useElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';
import { toLocalDayNumber } from '../../internals/utils/plain-date-utils/timeZone';
import type { BaseTemporal } from '../../internals/utils/base-temporal';
import { plainDateFromDayNumber } from '../../internals/utils/plain-date-utils/plainDate';
import { useCalendarGridDayRowContext } from '../day-row/CalendarGridDayRowContext';
import {
  schedulerOccurrencePlaceholderSelectors,
  schedulerOtherSelectors,
} from '../../scheduler-selectors';
import { CalendarGridDayEventContext } from './CalendarGridDayEventContext';
import { useEventCalendarStoreContext } from '../../use-event-calendar-store-context';
import { useCalendarGridDayCellContext } from '../day-cell/CalendarGridDayCellContext';
import type { useOriginalOccurrence } from '../../internals/utils/useOriginalOccurrence';

const overflowStateAttributesMapping = {
  startingBeforeEdge: (value: boolean) => (value ? { 'data-starting-before-edge': '' } : null),
  endingAfterEdge: (value: boolean) => (value ? { 'data-ending-after-edge': '' } : null),
};

export const CalendarGridDayEvent = React.forwardRef(function CalendarGridDayEvent(
  componentProps: CalendarGridDayEvent.Props,
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
    nativeButton = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  // Context hooks
  const store = useEventCalendarStoreContext();
  const { axis: rowAxis } = useCalendarGridDayRowContext();
  const { start: rowStart, end: rowEnd } = rowAxis;
  const { hasFocus: cellHasFocus } = useCalendarGridDayCellContext();
  const isRtl = useDirection() === 'rtl';

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Selector hooks
  const hasPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.isDefined);

  // Feature hooks
  const getDraggedDay = (input: { clientX: number }) => {
    const displayTimezone = schedulerOtherSelectors.displayTimezone(store.state);
    const startDay = toLocalDayNumber(start.timestamp, displayTimezone);
    if (!ref.current) {
      return plainDateFromDayNumber(startDay);
    }

    // The event covers every date from its start to its end in the row, like its cells.
    const firstDay = Math.max(startDay, toLocalDayNumber(rowStart, displayTimezone));
    const lastDay = Math.min(
      toLocalDayNumber(end.timestamp, displayTimezone),
      toLocalDayNumber(rowEnd, displayTimezone),
    );
    const elementPosition = ref.current.getBoundingClientRect();
    // Measured from the inline start, where the first day of the event is.
    const offsetFromStart = isRtl
      ? elementPosition.right - input.clientX
      : input.clientX - elementPosition.left;
    const positionX = offsetFromStart / ref.current.offsetWidth;

    return plainDateFromDayNumber(firstDay + Math.ceil(positionX * (lastDay - firstDay + 1)) - 1);
  };

  const elementPosition = useElementPositionInCollection({ start, end, collection: rowAxis });

  const { state, draggableProps, contextValue } = useDraggableEvent({
    kind: schedulerDayEventMoveKind,
    start,
    end,
    occurrenceKey,
    eventId,
    dataTimezone,
    isDraggable,
    renderDragPreview,
    getExtraDragData: (input) => ({ draggedDay: getDraggedDay(input) }),
    position: elementPosition,
  });

  const startingBeforeEdge = contextValue.isEventStartClipped;
  const endingAfterEdge = contextValue.isEventEndClipped;

  const mergedState = { ...state, startingBeforeEdge, endingAfterEdge };

  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: nativeButton,
    tabIndex: cellHasFocus ? 0 : -1,
  });

  // Rendering hooks
  const element = useRenderElement('div', componentProps, {
    state: mergedState,
    ref: [forwardedRef, buttonRef, ref],
    props: [
      elementProps,
      {
        style: hasPlaceholder ? { pointerEvents: 'none' as const } : undefined,
      },
      getButtonProps,
    ],
    stateAttributesMapping: overflowStateAttributesMapping,
  });

  return (
    <CalendarGridDayEventContext.Provider value={contextValue}>
      <SchedulerDraggable {...draggableProps} render={element} />
    </CalendarGridDayEventContext.Provider>
  );
});

export namespace CalendarGridDayEvent {
  export interface State extends useDraggableEvent.State {
    startingBeforeEdge: boolean;
    endingAfterEdge: boolean;
  }

  export interface Props
    extends
      BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      useDraggableEvent.PublicParameters,
      Pick<useOriginalOccurrence.Parameters, 'dataTimezone'> {}

  export interface DragData extends SchedulerEventDragData {
    /**
     * The day of the event the pointer grabbed, in the display timezone. A multi-day event moves
     * by whole days from it.
     */
    draggedDay: BaseTemporal.PlainDate;
  }
}
