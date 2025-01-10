'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useBaseCalendarMonthsGrid } from '../../utils/base-calendar/months-grid/useBaseCalendarMonthsGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { CalendarMonthsGridCssVars } from './CalendarMonthsGridCssVars';
import { BaseCalendarMonthsGridOrListContext } from '../../utils/base-calendar/months-grid/BaseCalendarMonthsGridOrListContext';

const CalendarMonthsGrid = React.forwardRef(function CalendarMonthsList(
  props: CalendarMonthsGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, canChangeYear, ...otherProps } = props;
  const { getMonthsGridProps, cellRefs, monthsListOrGridContext, scrollerRef } =
    useBaseCalendarMonthsGrid({
      children,
      cellsPerRow,
      canChangeYear,
      cellsPerRowCssVar: CalendarMonthsGridCssVars.calendarMonthsGridCellsPerRow,
    });
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthsGridProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarMonthsGridOrListContext.Provider value={monthsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarMonthsGridOrListContext.Provider>
  );
});

export namespace CalendarMonthsGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarMonthsGrid.PublicParameters {}
}

export { CalendarMonthsGrid };
