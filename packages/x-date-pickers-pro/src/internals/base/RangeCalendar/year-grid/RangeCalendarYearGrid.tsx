'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearGrid } from '@mui/x-date-pickers/internals/base/utils/base-calendar/year-grid/useBaseCalendarYearGrid';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarYearCollectionContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/utils/BaseCalendarYearCollectionContext';
import { RangeCalendarYearGridCssVars } from './RangeCalendarYearGridCssVars';
import { RangeCalendarYearGridDataAttributes } from './RangeCalendarYearGridDataAttributes';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarYearGrid.State> = {
  cellsPerRow(value) {
    return value ? { [RangeCalendarYearGridDataAttributes.cellsPerRow]: value.toString() } : null;
  },
};

const RangeCalendarYearGrid = React.forwardRef(function CalendarYearList(
  props: RangeCalendarYearGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, getItems, focusOnMount, ...otherProps } = props;
  const { getYearGridProps, yearsCellRefs, yearsListOrGridContext, scrollerRef } =
    useBaseCalendarYearGrid({
      children,
      getItems,
      focusOnMount,
      cellsPerRow,
      cellsPerRowCssVar: RangeCalendarYearGridCssVars.rangeCalendarYearGridCellsPerRow,
    });
  const state = React.useMemo<RangeCalendarYearGrid.State>(() => ({ cellsPerRow }), [cellsPerRow]);
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

namespace RangeCalendarYearGrid {
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

export { RangeCalendarYearGrid };
