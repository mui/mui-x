'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';

export const CalendarGridHeaderCell = React.forwardRef(function CalendarGridHeaderCell(
  componentProps: CalendarGridHeaderCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const props = React.useMemo(() => ({ role: 'Cell' }), []);

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace CalendarGridHeaderCell {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
