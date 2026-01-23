'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { useEventResizeHandler } from '@mui/x-scheduler-headless/internals';
import { SchedulerEventSide } from '@mui/x-scheduler-headless/models';
import { useEventTimelinePremiumEventContext } from '../event/EventTimelinePremiumEventContext';
import type { EventTimelinePremiumEvent } from '../event/EventTimelinePremiumEvent';

export const EventTimelinePremiumEventResizeHandler = React.forwardRef(
  function EventTimelinePremiumEventResizeHandler(
    componentProps: EventTimelinePremiumEventResizeHandler.Props,
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
    const contextValue = useEventTimelinePremiumEventContext();

    // Ref hooks
    const ref = React.useRef<HTMLDivElement>(null);

    // Feature hooks
    const getDragData = useStableCallback((input) => ({
      ...contextValue.getSharedDragData(input),
      source: 'EventTimelinePremiumEventResizeHandler',
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

export namespace EventTimelinePremiumEventResizeHandler {
  export interface State extends useEventResizeHandler.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useEventResizeHandler.PublicParameters {}

  export interface DragData extends EventTimelinePremiumEvent.SharedDragData {
    source: 'EventTimelinePremiumEventResizeHandler';
    side: SchedulerEventSide;
  }
}
