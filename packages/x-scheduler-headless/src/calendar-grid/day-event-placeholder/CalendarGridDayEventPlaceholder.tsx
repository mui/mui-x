'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useEvent } from '../../utils/useEvent';

const EVENT_PLACEHOLDER_PROPS = { style: { pointerEvents: 'none' as const } };

export const CalendarGridDayEventPlaceholder = React.forwardRef(
  function CalendarGridDayEventPlaceholder(
    componentProps: CalendarGridDayEventPlaceholder.Props,
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

    const { state } = useEvent({ start, end });

    return useRenderElement('div', componentProps, {
      state,
      ref: [forwardedRef],
      props: [elementProps, EVENT_PLACEHOLDER_PROPS],
    });
  },
);

export namespace CalendarGridDayEventPlaceholder {
  export interface State extends useEvent.State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
