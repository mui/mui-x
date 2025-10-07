'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useButton } from '../base-ui-copy/utils/useButton';
import { useRenderElement } from '../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../base-ui-copy/utils/types';
import { CalendarOccurrencePlaceholderExternalDragData } from '../models';
import { useDragPreview } from '../utils/useDragPreview';
import { EVENT_CREATION_DEFAULT_LENGTH_MINUTE } from '../constants';

export const StandaloneEvent = React.forwardRef(function StandaloneEvent(
  componentProps: StandaloneEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    data,
    duration = EVENT_CREATION_DEFAULT_LENGTH_MINUTE,
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

  const preview = useDragPreview({
    elementProps,
    componentProps,
    showPreviewOnDragStart: true,
  });

  const state: StandaloneEvent.State = React.useMemo(
    () => ({ dragging: preview.state.isDragging }),
    [preview.state.isDragging],
  );

  const getDragData = useEventCallback(() => ({
    source: 'StandaloneEvent',
    eventData: data,
    duration,
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
      onDragStart: ({ location }) => {
        preview.actions.onDragStart(location);
      },
      onDrag: ({ location }) => {
        preview.actions.onDrag(location);
      },
      onDrop: () => {
        preview.actions.onDrop();
      },
    });
  }, [isDraggable, getDragData, preview.actions]);

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef, ref],
    props: [elementProps, getButtonProps],
  });

  return (
    <React.Fragment>
      {element}
      {preview.element}
    </React.Fragment>
  );
});

export namespace StandaloneEvent {
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
     * The default duration of the event in minutes.
     * Will be ignored if the event is dropped on a UI that only handles multi-day events.
     * @default 30
     */
    duration: number;
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

  export interface DragData {
    source: 'StandaloneEvent';
    eventId: string | number;
    occurrenceKey: string;
    duration: number;
    eventData: CalendarOccurrencePlaceholderExternalDragData;
    onEventDrop?: () => void;
  }
}
