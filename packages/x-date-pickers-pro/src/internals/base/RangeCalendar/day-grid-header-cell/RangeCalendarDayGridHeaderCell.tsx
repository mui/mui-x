'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayGridHeaderCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-grid-header-cell/useBaseCalendarDayGridHeaderCell';

const RangeCalendarDayGridHeaderCell = React.forwardRef(function RangeCalendarDayGridHeaderCell(
  props: CalendarDayGridHeaderCell.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { className, render, value, formatter, ...otherProps } = props;
  const { getDayGridHeaderCellProps } = useBaseCalendarDayGridHeaderCell({ value, formatter });

  const state: CalendarDayGridHeaderCell.State = React.useMemo(() => ({}), []);

  const { renderElement } = useComponentRenderer({
    propGetter: getDayGridHeaderCellProps,
    render: render ?? 'span',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

export namespace CalendarDayGridHeaderCell {
  export interface State {}

  export interface Props
    extends useBaseCalendarDayGridHeaderCell.Parameters,
      BaseUIComponentProps<'span', State> {}
}

const MemoizedRangeCalendarDayGridHeaderCell = React.memo(RangeCalendarDayGridHeaderCell);

export { MemoizedRangeCalendarDayGridHeaderCell as RangeCalendarDayGridHeaderCell };
