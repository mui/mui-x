'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';

const DayGridRow = React.forwardRef(function DayGridRow(
  componentProps: DayGridRow.Props,
  forwardedRef: React.ForwardedRef<HTMLTableRowElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const props = React.useMemo(() => ({ role: 'row' }), []);

  const state: DayGridRow.State = React.useMemo(() => ({}), []);

  return useRenderElement('tr', componentProps, {
    state,
    ref: [forwardedRef],
    props: [props, elementProps],
  });
});

export namespace DayGridRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'tr', State> {}
}

export { DayGridRow };
