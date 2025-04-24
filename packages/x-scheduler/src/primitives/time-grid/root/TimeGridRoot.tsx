'use client';
import * as React from 'react';
import { useTimeGridRoot } from './useTimeGridRoot';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';

const TimeGridRoot = React.forwardRef(function CalendarRoot(
  componentProps: TimeGridRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { getRootProps } = useTimeGridRoot({});

  const state: TimeGridRoot.State = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [getRootProps, elementProps],
  });

  return renderElement();
});

export namespace TimeGridRoot {
  export interface State {}

  export interface Props extends useTimeGridRoot.Parameters, BaseUIComponentProps<'div', State> {}
}

export { TimeGridRoot };
