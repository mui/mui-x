'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useEventResizeHandler } from '../../utils/useEventResizeHandler';
import { useTimelineEventContext } from '../event/TimelineEventContext';
import type { TimelineEvent } from '../event/TimelineEvent';

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
  const enabled =
    (side === 'start' && !contextValue.doesEventStartBeforeRowStart) ||
    (side === 'end' && !contextValue.doesEventEndAfterRowEnd);

  const getDragData = useEventCallback(({ input }) => ({
    ...contextValue.getSharedDragData(input),
    source: 'TimelineEventResizeHandler',
    side,
  }));

  const { state } = useEventResizeHandler({
    ref,
    side,
    enabled,
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
    extends BaseUIComponentProps<'div', State>,
      Pick<useEventResizeHandler.Parameters, 'side'> {}

  export interface DragData extends TimelineEvent.SharedDragData {
    source: 'TimelineEventResizeHandler';
    side: 'start' | 'end';
  }
}
