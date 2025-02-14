'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useBaseCalendarYearGrid } from '../../utils/base-calendar/year-grid/useBaseCalendarYearGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { BaseCalendarYearGridOrListContext } from '../../utils/base-calendar/year-grid/BaseCalendarYearGridOrListContext';
import { CalendarYearGridCssVars } from './CalendarYearGridCssVars';

const CalendarYearGrid = React.forwardRef(function CalendarYearList(
  props: CalendarYearGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, getItems, focusOnMount, ...otherProps } = props;
  const { getYearGridProps, yearsCellRefs, yearsListOrGridContext, scrollerRef } =
    useBaseCalendarYearGrid({
      children,
      getItems,
      focusOnMount,
      cellsPerRow,
      cellsPerRowCssVar: CalendarYearGridCssVars.calendarYearGridCellsPerRow,
    });
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearGridProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarYearGridOrListContext.Provider value={yearsListOrGridContext}>
      <CompositeList elementsRef={yearsCellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarYearGridOrListContext.Provider>
  );
});

export namespace CalendarYearGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarYearGrid.PublicParameters {}
}

export { CalendarYearGrid };
