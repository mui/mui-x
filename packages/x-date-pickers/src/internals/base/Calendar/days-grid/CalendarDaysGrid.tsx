'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useBaseCalendarDaysGrid } from '../../utils/base-calendar/days-grid/useBaseCalendarDaysGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseCalendarDaysGridContext } from '../../utils/base-calendar/days-grid/BaseCalendarDaysGridContext';

const CalendarDaysGrid = React.forwardRef(function CalendarDaysGrid(
  props: CalendarDaysGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, fixedWeekNumber, focusOnMount, offset, ...otherProps } = props;
  const { getDaysGridProps, context, scrollerRef } = useBaseCalendarDaysGrid({
    fixedWeekNumber,
    focusOnMount,
    offset,
  });
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridProps,
    render: render ?? 'div',
    ref,
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
