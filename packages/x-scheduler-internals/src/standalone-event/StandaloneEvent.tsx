'use client';
import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { useButton } from '@base-ui/react/internals/use-button';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps, NonNativeButtonProps } from '@base-ui/react/internals/types';
import { schedulerExternalEventKind } from '../internals/utils/schedulerDrag';
import type { SchedulerOccurrencePlaceholderExternalDragData } from '../models';
import { useDragPreview } from '../internals/utils/useDragPreview';

function StandaloneEventElement({
  componentProps,
  dragProps,
  state,
  preview,
}: {
  componentProps: StandaloneEvent.Props;
  dragProps: React.ComponentPropsWithRef<'div'>;
  state: StandaloneEvent.State;
  preview: React.ReactNode;
}) {
  const { className, render, style, data, onEventDrop, renderDragPreview, ...elementProps } =
    componentProps;
  const { ref, ...dragElementProps } = dragProps;
  // TODO: Expose a real `interactive` prop to control button behavior.
  const { getButtonProps, buttonRef } = useButton({ disabled: false, native: false });
  const element = useRenderElement('div', componentProps, {
    state,
    ref: [ref, buttonRef],
    props: [dragElementProps, elementProps, getButtonProps],
  });
  return React.isValidElement<{ children?: React.ReactNode }>(element)
    ? React.cloneElement(element, {
        children: (
          <React.Fragment>
            {element.props.children}
            {preview}
          </React.Fragment>
        ),
      })
    : element;
}

const StandaloneEventInner = React.forwardRef(function StandaloneEventInner(
  props: StandaloneEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { data, onEventDrop, renderDragPreview } = props;
  const preview = useDragPreview({ type: 'standalone-event', data, renderDragPreview });
  const payload = React.useMemo<StandaloneEvent.DragData>(
    () => ({
      source: 'StandaloneEvent',
      eventData: data,
      onEventDrop,
      eventId: data.id,
      occurrenceKey: `external-${data.id}`,
    }),
    [data, onEventDrop],
  );
  return (
    <Draggable.Root
      ref={forwardedRef}
      kind={schedulerExternalEventKind}
      payload={payload}
      render={(dragProps, state) => (
        <StandaloneEventElement
          componentProps={props}
          dragProps={dragProps}
          state={{ dragging: state.dragging }}
          preview={preview.element}
        />
      )}
    />
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
