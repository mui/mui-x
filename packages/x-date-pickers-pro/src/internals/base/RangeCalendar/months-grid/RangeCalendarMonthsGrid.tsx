'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthsGrid } from '@mui/x-date-pickers/internals/base/utils/base-calendar/months-grid/useBaseCalendarMonthsGrid';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarMonthsGridOrListContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/months-grid/BaseCalendarMonthsGridOrListContext';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
import { RangeCalendarMonthsGridCssVars } from './RangeCalendarMonthsGridCssVars';

const RangeCalendarMonthsGrid = React.forwardRef(function RangeCalendarMonthsList(
  props: RangeCalendarMonthsGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, canChangeYear, ...otherProps } = props;
  const { getMonthsGridProps, cellRefs, monthsListOrGridContext } = useBaseCalendarMonthsGrid({
    children,
    cellsPerRow,
    canChangeYear,
    cellsPerRowCssVar: RangeCalendarMonthsGridCssVars.calendarMonthsGridCellsPerRow,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthsGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
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

export namespace RangeCalendarMonthsGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarMonthsGrid.PublicParameters {}
}

export { RangeCalendarMonthsGrid };
