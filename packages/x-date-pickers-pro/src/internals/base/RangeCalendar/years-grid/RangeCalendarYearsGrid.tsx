'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearsGrid } from '@mui/x-date-pickers/internals/base/utils/base-calendar/years-grid/useBaseCalendarYearsGrid';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CompositeList } from '@mui/x-date-pickers/internals/base/composite/list/CompositeList';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarYearsGridOrListContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/years-grid/BaseCalendarYearsGridOrListContext';

const RangeCalendarYearsGrid = React.forwardRef(function CalendarYearsList(
  props: RangeCalendarYearsGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, children, cellsPerRow, ...otherProps } = props;
  const { getYearsGridProps, yearsCellRefs, yearsListOrGridContext } = useBaseCalendarYearsGrid({
    children,
    cellsPerRow,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearsGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
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

export namespace RangeCalendarYearsGrid {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'div', State>, 'children'>,
      useBaseCalendarYearsGrid.Parameters {}
}

export { RangeCalendarYearsGrid };
