'use client';
import * as React from 'react';
import { useRenderElement } from '@base-ui/react/internals/useRenderElement';
import { BaseUIComponentProps } from '@base-ui/react/internals/types';

export const TimelineGridCell = React.forwardRef(function TimelineGridCell(
  componentProps: TimelineGridCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    style,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Add aria-colindex using Composite.
  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [elementProps, { role: 'cell' }],
  });
});

export namespace TimelineGridCell {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
