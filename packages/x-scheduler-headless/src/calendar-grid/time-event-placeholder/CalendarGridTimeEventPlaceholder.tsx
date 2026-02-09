'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { CalendarGridTimeEventPlaceholderCssVars } from './CalendarGridTimeEventPlaceholderCssVars';
import { useCalendarGridTimeColumnContext } from '../time-column/CalendarGridTimeColumnContext';
import { useEvent } from '../../internals/utils/useEvent';
import { useElementPositionInCollection } from '../../internals/utils/useElementPositionInCollection';

export const CalendarGridTimeEventPlaceholder = React.forwardRef(
  function CalendarGridTimeEventPlaceholder(
    componentProps: CalendarGridTimeEventPlaceholder.Props,
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

    const { start: columnStart, end: columnEnd } = useCalendarGridTimeColumnContext();

    const { position, duration } = useElementPositionInCollection({
      start,
      end,
      collectionStart: columnStart,
      collectionEnd: columnEnd,
    });

    const style = React.useMemo(
      () =>
        ({
          [CalendarGridTimeEventPlaceholderCssVars.yPosition]: `${position * 100}%`,
          [CalendarGridTimeEventPlaceholderCssVars.height]: `${duration * 100}%`,
        }) as React.CSSProperties,
      [position, duration],
    );

    const props = { style };

    const { state } = useEvent({ start, end });

    return useRenderElement('div', componentProps, {
      state,
      ref: [forwardedRef],
      props: [props, elementProps],
    });
  },
);

export namespace CalendarGridTimeEventPlaceholder {
  export interface State extends useEvent.State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
