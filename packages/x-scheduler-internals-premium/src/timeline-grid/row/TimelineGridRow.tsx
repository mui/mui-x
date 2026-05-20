'use client';
import * as React from 'react';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-internals/base-ui-copy';

export const TimelineGridRow = React.forwardRef(function TimelineGridRow(
  componentProps: TimelineGridRow.Props,
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

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [elementProps, { role: 'row' }],
  });
});

export namespace TimelineGridRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
