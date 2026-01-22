'use client';
import * as React from 'react';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';

export const TimelinePremiumRow = React.forwardRef(function TimelinePremiumRow(
  componentProps: TimelinePremiumRow.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  // TODO: Add aria-rowindex using Composite.
  const props = { role: 'row' };

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace TimelinePremiumRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
