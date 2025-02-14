'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useBaseCalendarMonthGrid } from '../../utils/base-calendar/month-grid/useBaseCalendarMonthGrid';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
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
  props: CalendarMonthGrid.Props,
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
    ...otherProps
  } = props;
  const { getMonthGridProps, cellRefs, monthsListOrGridContext, scrollerRef } =
    useBaseCalendarMonthGrid({
      children,
      getItems,
      focusOnMount,
      cellsPerRow,
      canChangeYear,
      cellsPerRowCssVar: CalendarMonthGridCssVars.calendarMonthGridCellsPerRow,
    });
  const state = React.useMemo<CalendarMonthGrid.State>(() => ({ cellsPerRow }), [cellsPerRow]);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthGridProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
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
      useBaseCalendarMonthGrid.PublicParameters {}
}

export { CalendarMonthGrid };
