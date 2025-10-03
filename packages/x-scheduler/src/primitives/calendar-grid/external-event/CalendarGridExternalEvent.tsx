'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { CalendarOccurrencePlaceholderExternalDragData } from '../../models';
import { CalendarGridSharedEventDragData } from '../../utils/drag-utils';

export const CalendarGridExternalEvent = React.forwardRef(function CalendarGridExternalEvent(
  componentProps: CalendarGridExternalEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    data,
    onEventDrop,
    isDraggable = false,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  const ref = React.useRef<HTMLDivElement>(null);
  const { getButtonProps, buttonRef } = useButton({ disabled: !isInteractive });
  const [dragPosition, setDragPosition] = React.useState<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const isDragging = dragPosition != null;

  const state: CalendarGridExternalEvent.State = React.useMemo(
    () => ({ dragging: isDragging }),
    [isDragging],
  );

  const getDragData = useEventCallback(() => ({
    source: 'CalendarGridExternalEvent',
    eventData: data,
    onEventDrop,
    eventId: data.id,
    occurrenceKey: `external-${data.id}`,
  }));

  React.useEffect(() => {
    if (!isDraggable) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return draggable({
      element: ref.current!,
      getInitialData: getDragData,
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart: ({ location }) => setDragPosition(location.initial.input),
      onDrag: (param) => {
        const { location } = param;
        if (
          location.current.dropTargets.some((el) => el.data.source === 'CalendarGridTimeColumn')
        ) {
          setDragPosition(null);
        } else {
          setDragPosition(location.current.input);
        }
      },
      onDrop: () => setDragPosition(null),
    });
  }, [isDraggable, getDragData]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [elementProps, getButtonProps],
  });

  return (
    <React.Fragment>
      {dragPosition != null && (
        <div
          style={{
            position: 'fixed',
            top: dragPosition.clientY,
            left: dragPosition.clientX,
            pointerEvents: 'none',
            backgroundColor: 'red',
            height: 50,
            width: 200,
            zIndex: 9999,
          }}
        >
          {data.title}
        </div>
      )}
      {element}
    </React.Fragment>
  );
});

export namespace CalendarGridExternalEvent {
  export interface State {
    /**
     * Whether the event is being dragged.
     */
    dragging: boolean;
  }

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The data of the event to insert in the Event Calendar when dropped.
     */
    data: CalendarOccurrencePlaceholderExternalDragData;
    /**
     * Whether the event can be dragged to be inserted inside the Event Calendar.
     * @default false
     */
    isDraggable?: boolean;
    /**
     * Callback fired when the event is dropped into the Event Calendar.
     */
    onEventDrop?: () => void;
  }

  export interface DragData extends CalendarGridSharedEventDragData {
    source: 'CalendarGridExternalEvent';
    eventData: CalendarOccurrencePlaceholderExternalDragData;
    onEventDrop?: () => void;
  }
}
