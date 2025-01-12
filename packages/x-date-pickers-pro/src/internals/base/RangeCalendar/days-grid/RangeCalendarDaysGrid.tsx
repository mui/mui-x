'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseCalendarDaysGridContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid/BaseCalendarDaysGridContext';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysGrid } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid/useBaseCalendarDaysGrid';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';

const RangeCalendarDaysGrid = React.forwardRef(function RangeCalendarDaysGrid(
  props: RangeCalendarDaysGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, fixedWeekNumber, offset, ...otherProps } = props;
  const { getDaysGridProps, context } = useBaseCalendarDaysGrid({
    fixedWeekNumber,
    offset,
  });
  const state = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridProps,
    render: render ?? 'div',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return (
    <BaseCalendarDaysGridContext.Provider value={context}>
      {renderElement()}
    </BaseCalendarDaysGridContext.Provider>
  );
});

export namespace RangeCalendarDaysGrid {
  export interface State {}

  export interface Props
    extends BaseUIComponentProps<'div', State>,
      useBaseCalendarDaysGrid.Parameters {}
}

export { RangeCalendarDaysGrid };
