'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDaysGridHeaderCell } from '../../utils/base-calendar/days-grid-header-cell/useBaseCalendarDaysGridHeaderCell';
import { BaseUIComponentProps } from '../../base-utils/types';

const CalendarDaysGridHeaderCell = React.forwardRef(function CalendarDaysGridHeaderCell(
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

const MemoizedCalendarDaysGridHeaderCell = React.memo(CalendarDaysGridHeaderCell);

export { MemoizedCalendarDaysGridHeaderCell as CalendarDaysGridHeaderCell };
