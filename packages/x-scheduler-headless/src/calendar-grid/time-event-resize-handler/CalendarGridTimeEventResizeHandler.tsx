'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useEventResizeHandler } from '../../utils/useEventResizeHandler';
import { useCalendarGridTimeEventContext } from '../time-event/CalendarGridTimeEventContext';
import type { CalendarGridTimeEvent } from '../time-event/CalendarGridTimeEvent';

export const CalendarGridTimeEventResizeHandler = React.forwardRef(
  function CalendarGridTimeEventResizeHandler(
    componentProps: CalendarGridTimeEventResizeHandler.Props,
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

    // Context hooks
    const contextValue = useCalendarGridTimeEventContext();

    // Ref hooks
    const ref = React.useRef<HTMLDivElement>(null);

    // Feature hooks
    const getDragData = useEventCallback(({ input }) => ({
      ...contextValue.getSharedDragData(input),
      source: 'TimelineEventResizeHandler',
      side,
    }));

    const { state, enabled } = useEventResizeHandler({
      ref,
      side,
      contextValue,
      getDragData,
    });

    return useRenderElement('div', componentProps, {
      enabled,
      state,
      ref: [forwardedRef, ref],
      props: [elementProps],
    });
  },
);

export namespace CalendarGridTimeEventResizeHandler {
  export interface State extends useEventResizeHandler.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      useEventResizeHandler.PublicParameters {}

  export interface DragData extends CalendarGridTimeEvent.SharedDragData {
    source: 'CalendarGridTimeEventResizeHandler';
    side: 'start' | 'end';
  }
}
