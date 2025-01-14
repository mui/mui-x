'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useComponentRenderer } from '@mui/x-date-pickers/internals/base/base-utils/useComponentRenderer';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';
import { useRangeCalendarYearsCell } from './useRangeCalendarYearsCell';
import { useRangeCalendarYearsCellWrapper } from './useRangeCalendarMonthsCellWrapper';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarYearsCell.State> = {
  ...rangeCellStyleHookMapping,
};

const InnerRangeCalendarYearsCell = React.forwardRef(function InnerRangeCalendarYearsCell(
  props: InnerRangeCalendarYearsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getYearsCellProps } = useRangeCalendarYearsCell({ value, format, ctx });

  const state: RangeCalendarYearsCell.State = useRangeCellState(ctx);

  const { renderElement } = useComponentRenderer({
    propGetter: getYearsCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarYearsCell = React.memo(InnerRangeCalendarYearsCell);

const RangeCalendarYearsCell = React.forwardRef(function RangeCalendarsYearCell(
  props: RangeCalendarYearsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useRangeCalendarYearsCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerRangeCalendarYearsCell ref={ref} {...props} ctx={ctx} />;
});

export namespace RangeCalendarYearsCell {
  export interface State extends RangeCellState {}

  export interface Props
    extends Omit<useRangeCalendarYearsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerRangeCalendarYearsCellProps
  extends useRangeCalendarYearsCell.Parameters,
    Omit<BaseUIComponentProps<'button', RangeCalendarYearsCell.State>, 'value'> {}

export { RangeCalendarYearsCell };
