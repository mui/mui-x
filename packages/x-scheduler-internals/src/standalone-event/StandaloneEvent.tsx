'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useButton } from '@base-ui/react/internals/use-button';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps, NonNativeButtonProps } from '@base-ui/react/internals/types';
import { registerSchedulerDraggable } from '../internals/utils/schedulerDrag';
import type { SchedulerOccurrencePlaceholderExternalDragData } from '../models';
import { useDragPreview } from '../internals/utils/useDragPreview';

const StandaloneEventInner = React.forwardRef(function StandaloneEventInner(
  componentProps: StandaloneEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
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

  const manager = Draggable.useDragDropManager();

  React.useEffect(() => {
    return registerSchedulerDraggable(manager, ref.current!, {
      getDragData,
      onMoveStart: ({ location }) => {
        preview.actions.onDragStart(location);
      },
      onMove: ({ location }) => {
        preview.actions.onDrag(location);
      },
      onMoveEnd: () => {
        preview.actions.onDrop();
      },
    });
  }, [manager, getDragData, preview.actions]);

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

export const StandaloneEvent = React.forwardRef(function StandaloneEvent(
  props: StandaloneEvent.Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <Draggable.Provider>
      <StandaloneEventInner {...props} ref={ref} />
    </Draggable.Provider>
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
      Pick<useDragPreview.Parameters, 'renderDragPreview'> {
    data: SchedulerOccurrencePlaceholderExternalDragData;
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
