'use client';
import * as React from 'react';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';

export const TimelineGridCell = React.forwardRef(function TimelineGridCell(
  componentProps: TimelineGridCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Add aria-colindex using Composite.
  const props = { role: 'cell' };

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace TimelineGridCell {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
