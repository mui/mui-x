'use client';
import * as React from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useCalendarGridDayEventContext } from '../day-event/CalendarGridDayEventContext';
import type { CalendarGridDayEvent } from '../day-event/CalendarGridDayEvent';

export const CalendarGridDayEventResizeHandler = React.forwardRef(
  function CalendarGridDayEventResizeHandler(
    componentProps: CalendarGridDayEventResizeHandler.Props,
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
    const {
      setIsResizing,
      getSharedDragData,
      doesEventStartBeforeRowStart,
      doesEventEndAfterRowEnd,
    } = useCalendarGridDayEventContext();

    const enabled =
      (side === 'start' && !doesEventStartBeforeRowStart) ||
      (side === 'end' && !doesEventEndAfterRowEnd);

    const state: CalendarGridDayEventResizeHandler.State = React.useMemo(
      () => ({ start: side === 'start', end: side === 'end' }),
      [side],
    );

    React.useEffect(() => {
      const domElement = ref.current;
      if (!domElement || !enabled) {
        return undefined;
      }

      return draggable({
        element: domElement,
        getInitialData: ({ input }) => ({
          ...getSharedDragData(input),
          source: 'CalendarGridDayEventResizeHandler',
          side,
        }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          disableNativeDragPreview({ nativeSetDragImage });
        },
        onDragStart: () => setIsResizing(true),
        onDrop: () => setIsResizing(false),
      });
    }, [enabled, side, setIsResizing, getSharedDragData]);

    return useRenderElement('div', componentProps, {
      enabled,
      state,
      ref: [forwardedRef, ref],
      props: [elementProps],
    });
  },
);

export namespace CalendarGridDayEventResizeHandler {
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

  export interface DragData extends CalendarGridDayEvent.SharedDragData {
    source: 'CalendarGridDayEventResizeHandler';
    side: 'start' | 'end';
  }
}
