'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useBaseCalendarYearGrid } from '../../utils/base-calendar/year-grid/useBaseCalendarYearGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { CompositeList } from '../../composite/list/CompositeList';
import { BaseCalendarYearCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarYearCollectionContext';
import { CalendarYearGridCssVars } from './CalendarYearGridCssVars';
import { CustomStyleHookMapping } from '../../base-utils/getStyleHookProps';
import { CalendarYearGridDataAttributes } from './CalendarYearGridDataAttributes';

const customStyleHookMapping: CustomStyleHookMapping<CalendarYearGrid.State> = {
  cellsPerRow(value) {
    return value ? { [CalendarYearGridDataAttributes.cellsPerRow]: value.toString() } : null;
  },
};

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
  const state = React.useMemo<CalendarYearGrid.State>(() => ({ cellsPerRow }), [cellsPerRow]);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearGridProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return (
    <BaseCalendarYearCollectionContext.Provider value={yearsListOrGridContext}>
      <CompositeList elementsRef={yearsCellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarYearCollectionContext.Provider>
  );
});

export namespace CalendarYearGrid {
  export interface State {
    /**
     * The number of cells per row.
     */
    cellsPerRow: number;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarYearGrid.PublicParameters {}
}

export { CalendarYearGrid };
