'use client';
import * as React from 'react';
import { useTimeGridEvent } from './useTimeGridEvent';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';

const TimeGridEvent = React.forwardRef(function CalendarCell(
  componentProps: TimeGridEvent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Hook props
    start,
    end,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { getEventProps } = useTimeGridEvent({ start, end });

  const state: TimeGridEvent.State = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [getEventProps, elementProps],
  });

  return renderElement();
});

export namespace TimeGridEvent {
  export interface State {}

  export interface Props extends useTimeGridEvent.Parameters, BaseUIComponentProps<'div', State> {}
}

export { TimeGridEvent };
