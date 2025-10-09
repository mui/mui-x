'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-ui-copy/utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-ui-copy/utils/types';
import { useDayCellDropTarget } from './useDayCellDropTarget';

export const CalendarGridDayCell = React.forwardRef(function CalendarGridDayCell(
  componentProps: CalendarGridDayCell.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    // Rendering props
    className,
    render,
    // Internal props
    value,
    addPropertiesToDroppedEvent,
    // Props forwarded to the DOM element
    ...elementProps
  } = componentProps;

  const dropTargetRef = useDayCellDropTarget({ value, addPropertiesToDroppedEvent });
  const props = React.useMemo(() => ({ role: 'gridcell' }), []);

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef, dropTargetRef],
    props: [props, elementProps],
  });
});

export namespace CalendarGridDayCell {
  export interface State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      useDayCellDropTarget.Parameters {}
}
