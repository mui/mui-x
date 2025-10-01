'use client';
import * as React from 'react';
import { useRenderElement } from '../../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../../base-ui-copy/utils/types';
import { useDayGridCellDropTarget } from './useDayGridCellDropTarget';

export const DayGridCell = React.forwardRef(function DayGridCell(
  componentProps: DayGridCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    value,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const dropTargetRef = useDayGridCellDropTarget({ value });
  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef],
    props: [props, elementProps],
  });
});

export namespace DayGridCell {
  export interface State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      useDayGridCellDropTarget.Parameters {}
}
