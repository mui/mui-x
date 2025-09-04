'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useStore } from '@base-ui-components/utils/store/useStore';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useEvent } from '../../utils/useEvent';
import { SchedulerValidDate } from '../../models';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { diffIn } from '../../utils/date-utils';
import { useDayGridRowContext } from '../row/DayGridRowContext';
import { useDayGridRootContext } from '../root/DayGridRootContext';
import { selectors } from '../root/store';

export const DayGridEvent = React.forwardRef(function DayGridEvent(
  componentProps: DayGridEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    eventId,
    isDraggable = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  const adapter = useAdapter();
  const ref = React.useRef<HTMLDivElement>(null);
  const { getButtonProps, buttonRef } = useButton({ disabled: !isInteractive });
  const { start: rowStart, end: rowEnd } = useDayGridRowContext();
  const { state: eventState, props: eventProps } = useEvent({ start, end });
  const { store } = useDayGridRootContext();
  const hasPlaceholder = useStore(store, selectors.hasPlaceholder);
  const isDragging = useStore(store, selectors.isDraggingEvent, eventId);

  const props = React.useMemo(
    () => (hasPlaceholder ? { style: { pointerEvents: 'none' as const } } : {}),
    [hasPlaceholder],
  );

  const state: DayGridEvent.State = React.useMemo(
    () => ({ ...eventState, dragging: isDragging }),
    [eventState, isDragging],
  );

  const getDraggedDay = useEventCallback((input: { clientX: number }) => {
    if (!ref.current) {
      return start;
    }

    const eventStartInRow = adapter.isBefore(start, rowStart) ? rowStart : start;
    const eventEndInRow = adapter.isAfter(end, rowEnd) ? rowEnd : end;
    const eventDayLengthInRow = diffIn(adapter, eventEndInRow, eventStartInRow, 'days') + 1;
    const clientX = input.clientX;
    const elementPosition = ref.current.getBoundingClientRect();
    const positionX = (clientX - elementPosition.x) / ref.current.offsetWidth;

    return adapter.addDays(eventStartInRow, Math.ceil(positionX * eventDayLengthInRow) - 1);
  });

  React.useEffect(() => {
    if (!isDraggable) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return draggable({
      element: ref.current!,
      getInitialData: ({ input }) => ({
        type: 'event',
        source: 'DayGridEvent',
        id: eventId,
        start,
        end,
        draggedDay: getDraggedDay(input),
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
    });
  }, [isDraggable, start, end, eventId, getDraggedDay]);

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [props, eventProps, elementProps, getButtonProps],
  });
});

export namespace DayGridEvent {
  export interface State extends useEvent.State {
    /**
     * Whether the event is being dragged.
     */
    dragging: boolean;
  }

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {
    /**
     * The unique identifier of the event.
     */
    eventId: string | number;
    /**
     * Whether the event can be dragged to change its start and end dates without changing the duration.
     * @default false
     */
    isDraggable?: boolean;
  }

  export interface DragData {
    type: 'event';
    source: 'DayGridEvent';
    id: string | number;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    draggedDay: SchedulerValidDate;
  }
}
