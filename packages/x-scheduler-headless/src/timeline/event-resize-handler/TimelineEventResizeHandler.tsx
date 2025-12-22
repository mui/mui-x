'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useEventResizeHandler } from '../../utils/useEventResizeHandler';
import { useTimelineEventContext } from '../event/TimelineEventContext';
import type { TimelineEvent } from '../event/TimelineEvent';
import { SchedulerEventSide } from '../../models';

export const TimelineEventResizeHandler = React.forwardRef(function TimelineEventResizeHandler(
  componentProps: TimelineEventResizeHandler.Props,
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
  const contextValue = useTimelineEventContext();

  // Ref hooks
  const ref = React.useRef<HTMLDivElement>(null);

  // Feature hooks
  const getDragData = useStableCallback((input) => ({
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
});

export namespace TimelineEventResizeHandler {
  export interface State extends useEventResizeHandler.State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>, useEventResizeHandler.PublicParameters {}

  export interface DragData extends TimelineEvent.SharedDragData {
    source: 'TimelineEventResizeHandler';
    side: SchedulerEventSide;
  }
}
