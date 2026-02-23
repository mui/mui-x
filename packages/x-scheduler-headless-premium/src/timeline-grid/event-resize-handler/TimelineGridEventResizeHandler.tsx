'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';
import { useEventResizeHandler } from '@mui/x-scheduler-headless/internals';
import { SchedulerEventSide } from '@mui/x-scheduler-headless/models';
import { useTimelineGridEventContext } from '../event/TimelineGridEventContext';
import type { TimelineGridEvent } from '../event/TimelineGridEvent';

export const TimelineGridEventResizeHandler = React.forwardRef(
  function TimelineGridEventResizeHandler(
    componentProps: TimelineGridEventResizeHandler.Props,
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
    const contextValue = useTimelineGridEventContext();

    // Ref hooks
    const ref = React.useRef<HTMLDivElement>(null);

    // Feature hooks
    const getDragData = useStableCallback((input) => ({
      ...contextValue.getSharedDragData(input),
      source: 'TimelineGridEventResizeHandler',
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

export namespace TimelineGridEventResizeHandler {
  export interface State extends useEventResizeHandler.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useEventResizeHandler.PublicParameters {}

  export interface DragData extends TimelineGridEvent.SharedDragData {
    source: 'TimelineGridEventResizeHandler';
    side: SchedulerEventSide;
  }
}
