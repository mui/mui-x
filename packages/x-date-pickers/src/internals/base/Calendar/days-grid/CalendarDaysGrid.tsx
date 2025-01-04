'use client';
import * as React from 'react';
import { useCalendarDaysGrid } from './useCalendarDaysGrid';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRender';
import { CalendarDaysGridContext } from './CalendarDaysGridContext';

const CalendarDaysGrid = React.forwardRef(function CalendarDaysGrid(
  props: CalendarDaysGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, alwaysVisible, fixedWeekNumber, ...otherProps } = props;
  const { getDaysGridProps, context, shouldRender } = useCalendarDaysGrid({
    alwaysVisible,
    fixedWeekNumber,
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

  if (!shouldRender) {
    return null;
  }

  return (
    <CalendarDaysGridContext.Provider value={context}>
      {renderElement()}
    </CalendarDaysGridContext.Provider>
  );
});

export namespace CalendarDaysGrid {
  export interface State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      useCalendarDaysGrid.Parameters {}
}

export { CalendarDaysGrid };
