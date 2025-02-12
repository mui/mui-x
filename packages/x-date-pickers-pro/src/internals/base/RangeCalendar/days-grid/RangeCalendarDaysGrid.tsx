'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
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
  const { className, render, fixedWeekNumber, offset, focusOnMount, ...otherProps } = props;
  const { getDaysGridProps, context, scrollerRef } = useBaseCalendarDaysGrid({
    fixedWeekNumber,
    focusOnMount,
    offset,
  });
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef, scrollerRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridProps,
    render: render ?? 'div',
    ref,
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
