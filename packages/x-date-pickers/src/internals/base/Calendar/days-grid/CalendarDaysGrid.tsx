'use client';
import * as React from 'react';
import { useBaseCalendarDaysGrid } from '../../utils/base-calendar/days-grid/useBaseCalendarDaysGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseCalendarDaysGridContext } from '../../utils/base-calendar/days-grid/BaseCalendarDaysGridContext';

const CalendarDaysGrid = React.forwardRef(function CalendarDaysGrid(
  props: CalendarDaysGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, fixedWeekNumber, offset, ...otherProps } = props;
  const { getDaysGridProps, context } = useBaseCalendarDaysGrid({
    fixedWeekNumber,
    offset,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarDaysGridContext.Provider value={context}>
      {renderElement()}
    </BaseCalendarDaysGridContext.Provider>
  );
});

export namespace CalendarDaysGrid {
  export interface State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      useBaseCalendarDaysGrid.Parameters {}
}

export { CalendarDaysGrid };
