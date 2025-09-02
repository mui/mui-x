'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useTimelineEventRowContext } from '../event-row/TimelineEventRowContext';
import { useEvent } from '../../utils/useEvent';
import { TimelineEventCssVars } from './TimelineEventCssVars';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';

export const TimelineEvent = React.forwardRef(function TimelineEvent(
  componentProps: TimelineEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
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

  const { start: rowStart, end: rowEnd } = useTimelineEventRowContext();

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: rowStart,
    collectionEnd: rowEnd,
  });

  const style = React.useMemo(
    () =>
      ({
        [TimelineEventCssVars.xPosition]: `${position * 100}%`,
        [TimelineEventCssVars.width]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

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
