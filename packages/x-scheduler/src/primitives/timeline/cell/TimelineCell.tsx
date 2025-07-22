'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';

export const TimelineCell = React.forwardRef(function TimelineCell(
  componentProps: TimelineCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const props = React.useMemo(() => ({ role: 'row' }), []);

  const state: TimelineCell.State = React.useMemo(() => ({}), []);

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace TimelineCell {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
