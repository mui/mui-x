'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
import { useRangeCalendarMonthCell } from './useRangeCalendarMonthCell';
import { useRangeCalendarMonthCellWrapper } from './useRangeCalendarMonthCellWrapper';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarMonthCell.State> = {
  ...rangeCellStyleHookMapping,
};

const InnerRangeCalendarMonthCell = React.forwardRef(function InnerRangeCalendarMonthCell(
  props: InnerRangeCalendarMonthCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getMonthCellProps } = useRangeCalendarMonthCell({ value, format, ctx });

  const state: RangeCalendarMonthCell.State = useRangeCellState(ctx);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarMonthCell = React.memo(InnerRangeCalendarMonthCell);

const RangeCalendarMonthCell = React.forwardRef(function RangeCalendarMonthCell(
  props: RangeCalendarMonthCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useRangeCalendarMonthCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerRangeCalendarMonthCell {...props} ref={ref} ctx={ctx} />;
});

namespace RangeCalendarMonthCell {
  export interface State extends RangeCellState {}

  export interface Props
    extends Omit<useRangeCalendarMonthCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerRangeCalendarMonthCellProps
  extends useRangeCalendarMonthCell.Parameters,
    Omit<BaseUIComponentProps<'button', RangeCalendarMonthCell.State>, 'value'> {}

export { RangeCalendarMonthCell };
