'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
import { RangeCalendarDaysCellDataAttributes } from './RangeCalendarDaysCellDataAttributes';
import { useRangeCalendarDaysCell } from './useRangeCalendarDaysCell';
import { useRangeCalendarDaysCellWrapper } from './useRangeCalendarDaysCellWrapper';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarDaysCell.State> = {
  ...rangeCellStyleHookMapping,
  outsideMonth(value) {
    return value ? { [RangeCalendarDaysCellDataAttributes.outsideMonth]: '' } : null;
  },
};

const InnerRangeCalendarDaysCell = React.forwardRef(function RangeCalendarDaysGrid(
  props: InnerRangeCalendarDaysCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...otherProps } = props;
  const { getDaysCellProps } = useRangeCalendarDaysCell({ value, ctx });

  const cellState = useRangeCellState(ctx);
  const state = React.useMemo<RangeCalendarDaysCell.State>(
    () => ({ ...cellState, outsideMonth: ctx.isOutsideCurrentMonth }),
    [cellState, ctx.isOutsideCurrentMonth],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarDaysCell = React.memo(InnerRangeCalendarDaysCell);

const RangeCalendarDaysCell = React.forwardRef(function RangeCalendarDaysCell(
  props: RangeCalendarDaysCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useRangeCalendarDaysCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerRangeCalendarDaysCell ref={ref} {...props} ctx={ctx} />;
});

export namespace RangeCalendarDaysCell {
  export interface State extends RangeCellState {
    /**
     * Whether the cell is outside the month rendered by the day grid wrapping it.
     */
    outsideMonth: boolean;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      Omit<useRangeCalendarDaysCell.Parameters, 'ctx'> {}
}

interface InnerRangeCalendarDaysCellProps
  extends Omit<BaseUIComponentProps<'button', RangeCalendarDaysCell.State>, 'value'>,
    useRangeCalendarDaysCell.Parameters {}

export { RangeCalendarDaysCell };
