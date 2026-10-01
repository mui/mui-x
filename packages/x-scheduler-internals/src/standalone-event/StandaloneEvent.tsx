'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { Draggable } from '@base-ui/react/draggable';
import { useButton } from '@base-ui/react/internals/use-button';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import type { BaseUIComponentProps, NonNativeButtonProps } from '@base-ui/react/internals/types';
import { schedulerExternalEventKind } from '../internals/utils/schedulerDrag';
import type { SchedulerExternalEventDragPayload } from '../internals/utils/schedulerDrag';
import type {
  SchedulerOccurrencePlaceholderExternalDragData,
  RenderDragPreviewParameters,
} from '../models';
import { SchedulerDragPreview } from '../internals/utils/SchedulerDragPreview';

function StandaloneEventElement({
  componentProps,
  dragProps,
  state,
}: {
  componentProps: StandaloneEvent.Props;
  dragProps: React.ComponentPropsWithRef<'div'>;
  state: StandaloneEvent.State;
}) {
  const {
    className,
    render,
    style,
    data,
    onEventDrop,
    renderDragPreview,
    nativeButton = false,
    ...elementProps
  } = componentProps;
  const { ref, ...dragElementProps } = dragProps;
  // TODO: Expose a real `interactive` prop to control button behavior.
  const { getButtonProps, buttonRef } = useButton({ disabled: false, native: nativeButton });
  const element = useRenderElement('div', componentProps, {
    state,
    ref: [ref, buttonRef],
    props: [dragElementProps, elementProps, getButtonProps],
  });
  // The preview renders nothing in place: beside the element, it stays inside the root without
  // becoming a child of whatever `render` returns.
  return (
    <React.Fragment>
      {element}
      <SchedulerDragPreview>
        {() => renderDragPreview({ type: 'standalone-event', data })}
      </SchedulerDragPreview>
    </React.Fragment>
  );
}

export const StandaloneEvent = React.forwardRef(function StandaloneEvent(
  props: StandaloneEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { data, onEventDrop } = props;
  const handleEventDrop = useStableCallback(onEventDrop);
  // The source's onMoveEnd runs before the target handles the drop. Let Scheduler
  // call onEventDrop after creating the event, not merely after landing on a target.
  const payload = React.useMemo<StandaloneEvent.DragData>(
    () => ({ eventData: data, onEventDrop: handleEventDrop }),
    [data, handleEventDrop],
  );
  return (
    // An external event usually renders outside any Scheduler, so it brings its own provider.
    <Draggable.Provider>
      <Draggable.Root
        ref={forwardedRef}
        kind={schedulerExternalEventKind}
        payload={payload}
        render={(dragProps, state) => (
          <StandaloneEventElement
            componentProps={props}
            dragProps={dragProps}
            state={{ dragging: state.dragging }}
          />
        )}
      />
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

  export interface Props extends BaseUIComponentProps<'div', State>, NonNativeButtonProps {
    /**
     * The event properties and optional duration. The Scheduler determines the dates from the drop position.
     */
    data: SchedulerOccurrencePlaceholderExternalDragData;
    /**
     * Whether the component renders a native `<button>` element when replacing it
     * via the `render` prop.
     * Set to `true` if the rendered element is a native button.
     * @default false
     */
    nativeButton?: boolean;
    /**
     * Renders the preview that follows the pointer outside the Scheduler.
     * @param {RenderDragPreviewParameters} parameters The dragged event.
     * @returns {React.ReactNode} The content of the preview.
     */
    renderDragPreview: (parameters: RenderDragPreviewParameters) => React.ReactNode;
    /**
     * Callback fired after the Scheduler handles the event drop.
     */
    onEventDrop?: () => void;
  }

  export type DragData = SchedulerExternalEventDragPayload;
}
