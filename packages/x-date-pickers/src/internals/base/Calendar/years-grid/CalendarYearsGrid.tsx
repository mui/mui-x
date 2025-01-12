'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useBaseCalendarYearsGrid } from '../../utils/base-calendar/years-grid/useBaseCalendarYearsGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { BaseCalendarYearsGridOrListContext } from '../../utils/base-calendar/years-grid/BaseCalendarYearsGridOrListContext';
import { CalendarYearsGridCssVars } from './CalendarYearsGridCssVars';

const CalendarYearsGrid = React.forwardRef(function CalendarYearsList(
  props: CalendarYearsGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, ...otherProps } = props;
  const { getYearsGridProps, yearsCellRefs, yearsListOrGridContext, scrollerRef } =
    useBaseCalendarYearsGrid({
      children,
      cellsPerRow,
      cellsPerRowCssVar: CalendarYearsGridCssVars.calendarYearsGridCellsPerRow,
    });
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearsGridProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarYearsGridOrListContext.Provider value={yearsListOrGridContext}>
      <CompositeList elementsRef={yearsCellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarYearsGridOrListContext.Provider>
  );
});

export namespace CalendarYearsGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarYearsGrid.PublicParameters {}
}

export { CalendarYearsGrid };
