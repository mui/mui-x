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
import { BaseCalendarYearGridOrListContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/year-grid/BaseCalendarYearGridOrListContext';
import { RangeCalendarYearGridCssVars } from './RangeCalendarYearGridCssVars';

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

export namespace RangeCalendarYearGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarYearGrid.PublicParameters {}
}

export { RangeCalendarYearGrid };
