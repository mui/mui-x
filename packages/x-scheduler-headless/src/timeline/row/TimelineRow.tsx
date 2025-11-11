'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';

export const TimelineRow = React.forwardRef(function TimelineRow(
  componentProps: TimelineRow.Props,
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

export namespace TimelineRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
