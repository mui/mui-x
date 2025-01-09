'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDaysGridHeaderCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/days-grid-header-cell/useBaseCalendarDaysGridHeaderCell';

const RangeCalendarDaysGridHeaderCell = React.forwardRef(function RangeCalendarDaysGridHeaderCell(
  props: CalendarDaysGridHeaderCell.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { className, render, value, formatter, ...otherProps } = props;
  const { getDaysGridHeaderCellProps } = useBaseCalendarDaysGridHeaderCell({ value, formatter });

  const state: CalendarDaysGridHeaderCell.State = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysGridHeaderCellProps,
    render: render ?? 'span',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

export namespace CalendarDaysGridHeaderCell {
  export interface State {}

  export interface Props
    extends useBaseCalendarDaysGridHeaderCell.Parameters,
      BaseUIComponentProps<'span', State> {}
}

const MemoizedRangeCalendarDaysGridHeaderCell = React.memo(RangeCalendarDaysGridHeaderCell);

export { MemoizedRangeCalendarDaysGridHeaderCell as RangeCalendarDaysGridHeaderCell };
