'use client';
import * as React from 'react';
import { useBaseCalendarDayGrid } from '../../utils/base-calendar/day-grid/useBaseCalendarDayGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';

const CalendarDayGrid = React.forwardRef(function CalendarDayGrid(
  props: CalendarDayGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, ...otherProps } = props;
  const { getDayGridProps } = useBaseCalendarDayGrid();
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDayGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

namespace CalendarDayGrid {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

export { CalendarDayGrid };
