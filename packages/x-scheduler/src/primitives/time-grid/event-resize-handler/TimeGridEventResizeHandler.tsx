'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useTimeGridEventContext } from '../event/TimeGridEventContext';
import { SchedulerValidDate } from '../../models';
import { getCursorPositionRelativeToElement } from '../../utils/drag-utils';

export const TimeGridEventResizeHandler = React.forwardRef(function TimeGridEventResizeHandler(
  componentProps: TimeGridEventResizeHandler.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    side: position,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const { eventId, start: eventStart, end: eventEnd } = useTimeGridEventContext();

  const props = React.useMemo(() => ({}), []);

  const state: TimeGridEventResizeHandler.State = React.useMemo(
    () => ({ start: position === 'start', end: position === 'end', dragging: isDragging }),
    [position, isDragging],
  );

  React.useEffect(() => {
    const domElement = ref.current;
    if (!domElement) {
      return () => {};
    }

    return draggable({
      element: domElement,
      getInitialData: ({ input }) => ({
        source: 'TimeGridEventResizeHandler',
        id: eventId,
        start: eventStart,
        end: eventEnd,
        position: getCursorPositionRelativeToElement({ ref, input }),
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [eventStart, eventEnd, eventId]);

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: [props, elementProps],
  });
});

export namespace TimeGridEventResizeHandler {
  export interface State {
    /**
     * Whether the resize handler is targeting the start date of the event.
     */
    start: boolean;
    /**
     * Whether the resize handler is targeting the end date of the event.
     */
    end: boolean;
    /**
     * Whether the resize handler is being dragged.
     */
    dragging: boolean;
  }

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * The date to edit when dragging the resize handler.
     */
    side: 'start' | 'end';
  }

  export interface DragData {
    source: 'TimeGridEventResizeHandler';
    id: string | number;
    start: SchedulerValidDate;
    end: SchedulerValidDate;
    side: 'start' | 'end';
    position: { y: number };
  }
}
