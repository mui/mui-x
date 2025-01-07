'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useCalendarDaysGridHeaderCell } from './useCalendarDaysGridHeaderCell';
import { BaseUIComponentProps } from '../../base-utils/types';

const CalendarDaysGridHeaderCell = React.forwardRef(function CalendarDaysGridHeaderCell(
  props: CalendarDaysGridHeaderCell.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { className, render, value, formatter, ...otherProps } = props;
  const { getDaysGridHeaderCellProps } = useCalendarDaysGridHeaderCell({ value, formatter });

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
    extends useCalendarDaysGridHeaderCell.Parameters,
      BaseUIComponentProps<'span', State> {}
}

const MemoizedCalendarDaysGridHeaderCell = React.memo(CalendarDaysGridHeaderCell);

export { MemoizedCalendarDaysGridHeaderCell as CalendarDaysGridHeaderCell };
