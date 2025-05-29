'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';

export const DayGridCell = React.forwardRef(function DayGridCell(
  componentProps: DayGridCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  const state: DayGridCell.State = React.useMemo(() => ({}), []);

  return useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace DayGridCell {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
