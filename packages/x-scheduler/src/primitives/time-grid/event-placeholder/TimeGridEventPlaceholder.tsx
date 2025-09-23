'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { TimeGridEventPlaceholderCssVars } from './TimeGridEventPlaceholderCssVars';
import { useTimeGridColumnContext } from '../column/TimeGridColumnContext';
import { useEvent } from '../../utils/useEvent';
import { useElementPositionInCollection } from '../../utils/useElementPositionInCollection';

export const TimeGridEventPlaceholder = React.forwardRef(function TimeGridEventPlaceholder(
  componentProps: TimeGridEventPlaceholder.Props,
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

  const { start: columnStart, end: columnEnd } = useTimeGridColumnContext();

  const { position, duration } = useElementPositionInCollection({
    start,
    end,
    collectionStart: columnStart,
    collectionEnd: columnEnd,
  });

  const style = React.useMemo(
    () =>
      ({
        [TimeGridEventPlaceholderCssVars.yPosition]: `${position * 100}%`,
        [TimeGridEventPlaceholderCssVars.height]: `${duration * 100}%`,
      }) as React.CSSProperties,
    [position, duration],
  );

  const props = React.useMemo(() => ({ style }), [style]);

  const { state, props: eventProps } = useEvent({ start, end });

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, eventProps, elementProps],
  });
});

export namespace TimeGridEventPlaceholder {
  export interface State extends useEvent.State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
