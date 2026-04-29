'use client';
import * as React from 'react';
import { useRenderElement, BaseUIComponentProps } from '@mui/x-scheduler-headless/base-ui-copy';

export const TimelineGridCell = React.forwardRef(function TimelineGridCell(
  componentProps: TimelineGridCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, style, ...elementProps } = componentProps;

  const role = (elementProps as { role?: React.AriaRole }).role ?? 'gridcell';

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [elementProps, { role }],
  });
});

export namespace TimelineGridCell {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
