'use client';
import * as React from 'react';
import { useEventGridCell } from './useEventGridCell';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';

const EventGridCell = React.forwardRef(function CalendarCell(
  componentProps: EventGridCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Hook props
    start,
    end,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const { getCellProps } = useEventGridCell({ start, end });

  const state: EventGridCell.State = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef],
    props: [getCellProps, elementProps],
  });

  return renderElement();
});

export namespace EventGridCell {
  export interface State {}

  export interface Props extends useEventGridCell.Parameters, BaseUIComponentProps<'div', State> {}
}

export { EventGridCell };
