'use client';
import * as React from 'react';
import { useCalendarMonthGrid } from './useCalendarMonthGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { CompositeList } from '../../composite/list/CompositeList';
import { CalendarMonthGridCssVars } from './CalendarMonthGridCssVars';
import { BaseCalendarMonthCollectionContext } from '../../utils/base-calendar/utils/BaseCalendarMonthCollectionContext';
import { CustomStyleHookMapping } from '../../base-utils/getStyleHookProps';
import { CalendarMonthGridDataAttributes } from './CalendarMonthGridDataAttributes';

const customStyleHookMapping: CustomStyleHookMapping<CalendarMonthGrid.State> = {
  cellsPerRow(value) {
    return value ? { [CalendarMonthGridDataAttributes.cellsPerRow]: value.toString() } : null;
  },
};

const CalendarMonthGrid = React.forwardRef(function CalendarMonthList(
  componentProps: CalendarMonthGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    children,
    getItems,
    focusOnMount,
    cellsPerRow,
    canChangeYear,
    ...elementProps
  } = componentProps;

  const { getMonthGridProps, cellRefs, monthsListOrGridContext, scrollerRef } =
    useCalendarMonthGrid({
      children,
      getItems,
      focusOnMount,
      cellsPerRow,
      canChangeYear,
      cellsPerRowCssVar: CalendarMonthGridCssVars.calendarMonthGridCellsPerRow,
    });

  const state = React.useMemo<CalendarMonthGrid.State>(() => ({ cellsPerRow }), [cellsPerRow]);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, scrollerRef],
    props: [getMonthGridProps, elementProps],
    customStyleHookMapping,
  });

  return (
    <BaseCalendarMonthCollectionContext.Provider value={monthsListOrGridContext}>
      <CompositeList elementsRef={cellRefs}>{renderElement()}</CompositeList>
    </BaseCalendarMonthCollectionContext.Provider>
  );
});

export namespace CalendarMonthGrid {
  export interface State {
    /**
     * The number of cells per row.
     */
    cellsPerRow: number;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useCalendarMonthGrid.PublicParameters {}
}

export { CalendarMonthGrid };
