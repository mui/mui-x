'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { CompositeList } from '../../base-ui-copy/composite/list/CompositeList';

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

  const props = { role: 'row' };
  const cellsRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const element = useRenderElement('div', componentProps, {
    ref: [forwardedRef],
    props: [props, elementProps],
  });

  return <CompositeList elementsRef={cellsRefs}>{element}</CompositeList>;
});

export namespace CalendarGridHeaderRow {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}
