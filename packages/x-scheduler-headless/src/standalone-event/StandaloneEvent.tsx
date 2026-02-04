'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useButton } from '../base-ui-copy/utils/useButton';
import { useRenderElement } from '../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps, NonNativeButtonProps } from '../base-ui-copy/utils/types';
import { SchedulerOccurrencePlaceholderExternalDragData } from '../models';
import { useDragPreview } from '../internals/utils/useDragPreview';

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
    onEventDrop,
    renderDragPreview,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  const ref = React.useRef<HTMLDivElement>(null);
  const { getButtonProps, buttonRef } = useButton({
    disabled: !isInteractive,
    native: false,
  });

  const preview = useDragPreview({
    type: 'standalone-event',
    data,
    renderDragPreview,
    showPreviewOnDragStart: true,
  });

  const state: StandaloneEvent.State = React.useMemo(
    () => ({ dragging: preview.state.isDragging }),
    [preview.state.isDragging],
  );

  const getDragData = useStableCallback(() => ({
    source: 'StandaloneEvent',
    eventData: data,
    onEventDrop,
    eventId: data.id,
    occurrenceKey: `external-${data.id}`,
  }));

  React.useEffect(() => {
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
  }, [getDragData, preview.actions]);

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

  export interface Props
    extends
      BaseUIComponentProps<'div', State>,
      NonNativeButtonProps,
      Pick<useDragPreview.Parameters, 'renderDragPreview' | 'data'> {
    /**
     * Callback fired when the event is dropped into the Event Calendar.
     */
    onEventDrop?: () => void;
  }

  export interface DragData {
    source: 'StandaloneEvent';
    eventId: string | number;
    occurrenceKey: string;
    eventData: SchedulerOccurrencePlaceholderExternalDragData;
    onEventDrop?: () => void;
  }
}
