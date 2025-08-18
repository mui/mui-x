'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useEvent } from '../../utils/useEvent';
import { SchedulerValidDate } from '../../models';

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

  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const { getButtonProps, buttonRef } = useButton({ disabled: !isInteractive });

  const { state: eventState, props: eventProps } = useEvent({ start, end });

  const state: DayGridEvent.State = React.useMemo(
    () => ({ ...eventState, dragging: isDragging }),
    [eventState, isDragging],
  );

  React.useEffect(() => {
    if (!isDraggable) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return draggable({
      element: ref.current!,
      getInitialData: () => ({
        type: 'event',
        source: 'DayGridEvent',
        id: eventId,
        start,
        end,
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [isDraggable, start, end, eventId]);

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [eventProps, elementProps, getButtonProps],
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
  }
}
