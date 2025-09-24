'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';

const EVENT_PLACEHOLDER_PROPS = { style: { pointerEvents: 'none' as const } };

export const DayGridEventPlaceholder = React.forwardRef(function DayGridEventPlaceholder(
  componentProps: DayGridEventPlaceholder.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [elementProps, EVENT_PLACEHOLDER_PROPS],
  });
});

export namespace DayGridEventPlaceholder {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
