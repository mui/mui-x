'use client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useRenderElement } from '@mui/x-date-pickers/internals/base/base-utils/useRenderElement';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';
import { useRangeCalendarYearCell } from './useRangeCalendarYearCell';
import { useRangeCalendarYearCellWrapper } from './useRangeCalendarYearCellWrapper';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarYearCell.State> = {
  ...rangeCellStyleHookMapping,
};

const InnerRangeCalendarYearCell = React.forwardRef(function InnerRangeCalendarYearCell(
  componentProps: InnerRangeCalendarYearCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...elementProps } = componentProps;
  const { getYearCellProps } = useRangeCalendarYearCell({ value, format, ctx });

  const state: RangeCalendarYearCell.State = useRangeCellState(ctx);

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: [forwardedRef],
    props: [getYearCellProps, elementProps],
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
