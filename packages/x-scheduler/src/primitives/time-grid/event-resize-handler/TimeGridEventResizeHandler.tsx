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
    side,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const ref = React.useRef<HTMLDivElement>(null);
  const { eventId, setIsResizing, start: eventStart, end: eventEnd } = useTimeGridEventContext();

  const props = React.useMemo(() => ({}), []);

  const state: TimeGridEventResizeHandler.State = React.useMemo(
    () => ({ start: side === 'start', end: side === 'end' }),
    [side],
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
        side,
        position: getCursorPositionRelativeToElement({ ref, input }),
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart: () => setIsResizing(true),
      onDrop: () => setIsResizing(false),
    });
  }, [eventStart, eventEnd, eventId, side, setIsResizing]);

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
