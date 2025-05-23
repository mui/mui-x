'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useEventState } from '../../utils/useEventState';

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

  const props = React.useMemo(() => ({}), []);

  const state = useEventState({ start, end });

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace DayGridEvent {
  export interface State extends useEventState.ReturnValue {}

  export interface Props extends BaseUIComponentProps<'div', State>, useEventState.Parameters {}
}
