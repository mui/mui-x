'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
import { RangeCalendarDayCellDataAttributes } from './RangeCalendarDayCellDataAttributes';
import { useRangeCalendarDayCell } from './useRangeCalendarDayCell';
import { useRangeCalendarDayCellWrapper } from './useRangeCalendarDayCellWrapper';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarDayCell.State> = {
  ...rangeCellStyleHookMapping,
  outsideMonth(value) {
    return value ? { [RangeCalendarDayCellDataAttributes.outsideMonth]: '' } : null;
  },
};

const InnerRangeCalendarDayCell = React.forwardRef(function RangeCalendarDayGrid(
  props: InnerRangeCalendarDayCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...otherProps } = props;
  const { getDayCellProps } = useRangeCalendarDayCell({ value, ctx });

  const cellState = useRangeCellState(ctx);
  const state = React.useMemo<RangeCalendarDayCell.State>(
    () => ({
      ...cellState,
      startOfWeek: ctx.isStartOfWeek,
      endOfWeek: ctx.isEndOfWeek,
      outsideMonth: ctx.isOutsideCurrentMonth,
    }),
    [cellState, ctx.isStartOfWeek, ctx.isEndOfWeek, ctx.isOutsideCurrentMonth],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getDayCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarDayCell = React.memo(InnerRangeCalendarDayCell);

const RangeCalendarDayCell = React.forwardRef(function RangeCalendarDayCell(
  props: RangeCalendarDayCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useRangeCalendarDayCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerRangeCalendarDayCell ref={ref} {...props} ctx={ctx} />;
});

export namespace RangeCalendarDayCell {
  export interface State extends RangeCellState {
    /**
     * Whether the day is the first day of its week.
     */
    startOfWeek: boolean;
    /**
     * Whether the day is the last day of its week.
     */
    endOfWeek: boolean;
    /**
     * Whether the cell is outside the month rendered by the day grid wrapping it.
     */
    outsideMonth: boolean;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      Omit<useRangeCalendarDayCell.Parameters, 'ctx'> {}
}

interface InnerRangeCalendarDayCellProps
  extends Omit<BaseUIComponentProps<'button', RangeCalendarDayCell.State>, 'value'>,
    useRangeCalendarDayCell.Parameters {}

export { RangeCalendarDayCell };
