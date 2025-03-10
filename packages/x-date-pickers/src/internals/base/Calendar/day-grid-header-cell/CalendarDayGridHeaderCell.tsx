'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDayGridHeaderCell } from '../../utils/base-calendar/day-grid-header-cell/useBaseCalendarDayGridHeaderCell';
import { BaseUIComponentProps } from '../../base-utils/types';

const CalendarDayGridHeaderCell = React.forwardRef(function CalendarDayGridHeaderCell(
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

const MemoizedCalendarDayGridHeaderCell = React.memo(CalendarDayGridHeaderCell);

export { MemoizedCalendarDayGridHeaderCell as CalendarDayGridHeaderCell };
