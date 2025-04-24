'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { useCalendarDayGridHeaderCell } from './useCalendarDayGridHeaderCell';
import { BaseUIComponentProps } from '../../base-utils/types';

const CalendarDayGridHeaderCell = React.forwardRef(function CalendarDayGridHeaderCell(
  componentProps: CalendarDayGridHeaderCell.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { className, render, value, formatter, ...otherProps } = componentProps;
  const { getDayGridHeaderCellProps } = useCalendarDayGridHeaderCell({ value, formatter });

  const state: CalendarDayGridHeaderCell.State = React.useMemo(() => ({}), []);

  const renderElement = useRenderElement('span', componentProps, {
    state,
    ref: forwardedRef,
    props: [getDayGridHeaderCellProps, otherProps],
  });

  return renderElement();
});

export namespace CalendarDayGridHeaderCell {
  export interface State {}

  export interface Props
    extends useCalendarDayGridHeaderCell.Parameters,
      BaseUIComponentProps<'span', State> {}
}

const MemoizedCalendarDayGridHeaderCell = React.memo(CalendarDayGridHeaderCell);

export { MemoizedCalendarDayGridHeaderCell as CalendarDayGridHeaderCell };
