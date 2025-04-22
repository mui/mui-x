'use client';
import * as React from 'react';
import { useEventGridRoot } from './useEventGridRoot';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';

const EventGridRoot = React.forwardRef(function CalendarRoot(
  componentProps: EventGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { getRootProps } = useEventGridRoot({});

  const state: EventGridRoot.State = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [getRootProps, elementProps],
  });

  return renderElement();
});

export namespace EventGridRoot {
  export interface State {}

  export interface Props extends useEventGridRoot.Parameters, BaseUIComponentProps<'div', State> {}
}

export { EventGridRoot };
