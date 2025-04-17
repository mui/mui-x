'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
// eslint-disable-next-line no-restricted-imports
import { useRenderElement } from '@mui/x-date-pickers/internals/base/base-utils/useRenderElement';
import { useRangeCalendarMonthCell } from './useRangeCalendarMonthCell';
import { useRangeCalendarMonthCellWrapper } from './useRangeCalendarMonthCellWrapper';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarMonthCell.State> = {
  ...rangeCellStyleHookMapping,
};

const InnerRangeCalendarMonthCell = React.forwardRef(function InnerRangeCalendarMonthCell(
  componentProps: InnerRangeCalendarMonthCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...elementProps } = componentProps;
  const { getMonthCellProps } = useRangeCalendarMonthCell({ value, format, ctx });

  const state: RangeCalendarMonthCell.State = useRangeCellState(ctx);

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: [forwardedRef],
    props: [getMonthCellProps, elementProps],
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

export namespace RangeCalendarMonthCell {
  export interface State extends RangeCellState {}

  export interface Props
    extends Omit<useRangeCalendarMonthCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerRangeCalendarMonthCellProps
  extends useRangeCalendarMonthCell.Parameters,
    Omit<BaseUIComponentProps<'button', RangeCalendarMonthCell.State>, 'value'> {}

export { RangeCalendarMonthCell };
