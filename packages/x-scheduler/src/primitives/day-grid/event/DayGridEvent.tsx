'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useEvent } from '../../utils/useEvent';

export const DayGridEvent = React.forwardRef(function DayGridEvent(
  componentProps: DayGridEvent.Props,
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

  const { state, props: eventProps } = useEvent({ start, end });

  console.log('DayGridEvent', state, eventProps);

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [eventProps, elementProps],
  });
});

export namespace DayGridEvent {
  export interface State extends useEvent.State {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEvent.Parameters {}
}
