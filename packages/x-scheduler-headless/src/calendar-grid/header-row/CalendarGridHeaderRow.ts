'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';

export const CalendarGridHeaderRow = React.forwardRef(function CalendarGridHeaderRow(
  componentProps: CalendarGridHeaderRow.Props,
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

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace CalendarGridHeaderRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
