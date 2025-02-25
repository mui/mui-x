'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';
import { useRangeCalendarYearCell } from './useRangeCalendarYearCell';
import { useRangeCalendarYearCellWrapper } from './useRangeCalendarYearCellWrapper';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarYearCell.State> = {
  ...rangeCellStyleHookMapping,
};

const InnerRangeCalendarYearCell = React.forwardRef(function InnerRangeCalendarYearCell(
  props: InnerRangeCalendarYearCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getYearCellProps } = useRangeCalendarYearCell({ value, format, ctx });

  const state: RangeCalendarYearCell.State = useRangeCellState(ctx);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarYearCell = React.memo(InnerRangeCalendarYearCell);

const RangeCalendarYearCell = React.forwardRef(function RangeCalendarsYearCell(
  props: RangeCalendarYearCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useRangeCalendarYearCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerRangeCalendarYearCell ref={ref} {...props} ctx={ctx} />;
});

export namespace RangeCalendarYearCell {
  export interface State extends RangeCellState {}

  export interface Props
    extends Omit<useRangeCalendarYearCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerRangeCalendarYearCellProps
  extends useRangeCalendarYearCell.Parameters,
    Omit<BaseUIComponentProps<'button', RangeCalendarYearCell.State>, 'value'> {}

export { RangeCalendarYearCell };
