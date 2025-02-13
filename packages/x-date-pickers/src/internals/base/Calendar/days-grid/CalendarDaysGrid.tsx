'use client';
import * as React from 'react';
import { useBaseCalendarDaysGrid } from '../../utils/base-calendar/days-grid/useBaseCalendarDaysGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';

const CalendarDaysGrid = React.forwardRef(function CalendarDaysGrid(
  props: CalendarDaysGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, ...otherProps } = props;
  const { getDaysGridProps } = useBaseCalendarDaysGrid();
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

export namespace CalendarDaysGrid {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

export { CalendarDaysGrid };
