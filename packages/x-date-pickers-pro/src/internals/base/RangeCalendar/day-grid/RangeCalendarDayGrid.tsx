'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayGrid } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid/useBaseCalendarDayGrid';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';

const RangeCalendarDayGrid = React.forwardRef(function RangeCalendarDayGrid(
  props: RangeCalendarDayGrid.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, ...otherProps } = props;
  const { getDayGridProps } = useBaseCalendarDayGrid();
  const state = React.useMemo(() => ({}), []);
  const ref = useForkRef(forwardedRef);

  const { renderElement } = useComponentRenderer({
    propGetter: getDayGridProps,
    render: render ?? 'div',
    ref,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

namespace RangeCalendarDayGrid {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

export { RangeCalendarDayGrid };
