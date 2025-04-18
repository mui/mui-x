'use client';
import * as React from 'react';
import { useCalendarYearGrid } from './useCalendarYearGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { CompositeList } from '../../base-utils/composite/list/CompositeList';
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
  componentProps: CalendarYearGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, getItems, focusOnMount, ...elementProps } =
    componentProps;
  const { getYearGridProps, yearsCellRefs, yearsListOrGridContext, scrollerRef } =
    useCalendarYearGrid({
      children,
      getItems,
      focusOnMount,
      cellsPerRow,
      cellsPerRowCssVar: CalendarYearGridCssVars.calendarYearGridCellsPerRow,
    });
  const state = React.useMemo<CalendarYearGrid.State>(() => ({ cellsPerRow }), [cellsPerRow]);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, scrollerRef],
    props: [getYearGridProps, elementProps],
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
      useCalendarYearGrid.PublicParameters {}
}

export { CalendarYearGrid };
