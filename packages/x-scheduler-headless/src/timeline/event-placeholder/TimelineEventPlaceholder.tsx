'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useTimelineEventRowContext } from '../event-row/TimelineEventRowContext';
import { useEvent } from '../../utils/useEvent';
import { TimelineEventPlaceholderCssVars } from './TimelineEventPlaceholderCssVars';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';

export const TimelineEventPlaceholder = React.forwardRef(function TimelineEventPlaceholder(
  componentProps: TimelineEventPlaceholder.Props,
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

  // Context hooks
  const { start: rowStart, end: rowEnd } = useTimelineEventRowContext();

  // Feature hooks
  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: rowStart,
    collectionEnd: rowEnd,
  });

  // Rendering hooks
  const style = React.useMemo(
    () =>
      ({
        [TimelineEventPlaceholderCssVars.xPosition]: `${position * 100}%`,
        [TimelineEventPlaceholderCssVars.width]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = React.useMemo(() => ({ style }), [style]);

  const { state } = useEvent({ start, end });

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace TimelineEventPlaceholder {
  export interface State extends useEvent.State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
