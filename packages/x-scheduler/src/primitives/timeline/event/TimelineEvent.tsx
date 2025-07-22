'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useTimelineRowEventsContext } from '../row-events/TImelineRowEventsContext';
import { SchedulerValidDate } from '../../models';
import { useAdapter } from '../../utils/adapter/useAdapter';
import { useEvent } from '../../utils/useEvent';
import { TimelineEventCssVars } from './TimelineEventCssVars';

export const TimelineEvent = React.forwardRef(function TimelineEvent(
  componentProps: TimelineEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const adapter = useAdapter();

  const {
    // Rendering props
    className,
    render,
    // Internal props
    start,
    end,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Expose a real `interactive` prop
  // to control whether the event should behave like a button
  const isInteractive = true;

  const { getButtonProps, buttonRef } = useButton({ disabled: !isInteractive });

  const { start: rowStart, end: rowEnd } = useTimelineRowEventsContext();

  const style = React.useMemo(() => {
    // TODO: Avoid JS date conversion
    const getTimestamp = (date: SchedulerValidDate) => adapter.toJsDate(date).getTime();

    const rowStartTimestamp = getTimestamp(rowStart);
    const rowEndTimestamp = getTimestamp(rowEnd);
    const eventStartTimestamp = getTimestamp(start);
    const eventEndTimestamp = getTimestamp(end);
    const rowDurationMs = rowEndTimestamp - rowStartTimestamp;

    const startTimestamp = Math.max(eventStartTimestamp, rowStartTimestamp);
    const endTimestamp = Math.min(eventEndTimestamp, rowEndTimestamp);

    const startPosition = (startTimestamp - rowStartTimestamp) / rowDurationMs;
    const duration = (endTimestamp - startTimestamp) / rowDurationMs;

    return {
      [TimelineEventCssVars.xPosition]: `${startPosition * 100}%`,
      [TimelineEventCssVars.width]: `${duration * 100}%`,
    } as React.CSSProperties;
  }, [adapter, rowStart, rowEnd, start, end]);

  const props = React.useMemo(() => ({ style }), [style]);

  const { state, props: eventProps } = useEvent({ start, end });

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef],
    props: [props, eventProps, elementProps, getButtonProps],
  });
});

export namespace TimelineEvent {
  export interface State extends useEvent.State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
