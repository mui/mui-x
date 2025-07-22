'use client';
import * as React from 'react';
import { useButton } from '../../../base-ui-copy/utils/useButton';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridEventCssVars } from './TimeGridEventCssVars';
import { useTimeGridColumnContext } from '../column/TimeGridColumnContext';
import { useEvent } from '../../utils/useEvent';
import { useEventPosition } from '../../utils/useEventPosition';

export const TimeGridEvent = React.forwardRef(function TimeGridEvent(
  componentProps: TimeGridEvent.Props,
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

  const { start: columnStart, end: columnEnd } = useTimeGridColumnContext();

  const { position, duration } = useEventPosition({
    start,
    end,
    collectionStart: columnStart,
    collectionEnd: columnEnd,
  });

  const style = React.useMemo(
    () =>
      ({
        [TimeGridEventCssVars.yPosition]: `${position * 100}%`,
        [TimeGridEventCssVars.height]: `${duration * 100}%`,
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

export namespace TimeGridEvent {
  export interface State extends useEvent.State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
