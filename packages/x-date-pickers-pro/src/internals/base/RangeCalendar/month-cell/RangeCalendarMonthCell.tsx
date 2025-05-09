'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
// eslint-disable-next-line no-restricted-imports
import { useRenderElement } from '@mui/x-date-pickers/internals/base/base-utils/useRenderElement';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/month-cell/useBaseCalendarMonthCell';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarMonthCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/month-cell/useBaseCalendarMonthCellWrapper';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';
import { useRangeCell } from '../utils/useRangeCell';
import { useRangeCellWrapper } from '../utils/useRangeCellWrapper';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarMonthCell.State> = {
  ...rangeCellStyleHookMapping,
};

const InnerRangeCalendarMonthCell = React.forwardRef(function InnerRangeCalendarMonthCell(
  componentProps: InnerRangeCalendarMonthCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...elementProps } = componentProps;

  const { props } = useBaseCalendarMonthCell({ value, format, ctx });
  const rangeCellProps = useRangeCell({ ctx, value, section: 'month' });
  const state: RangeCalendarMonthCell.State = useRangeCellState(ctx);

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: forwardedRef,
    props: [props, rangeCellProps, elementProps],
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarMonthCell = React.memo(InnerRangeCalendarMonthCell);

const RangeCalendarMonthCell = React.forwardRef(function RangeCalendarMonthCell(
  props: RangeCalendarMonthCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref: baseRef, ctx: baseCtx } = useBaseCalendarMonthCellWrapper({
    value: props.value,
    forwardedRef,
  });
  const { cellRef, ctx: rangeCellCtx } = useRangeCellWrapper({
    value: props.value,
    section: 'month',
  });
  const ref = useForkRef(baseRef, cellRef);

  const ctx = React.useMemo<InnerRangeCalendarMonthCellPropsContext>(
    () => ({
      ...baseCtx,
      ...rangeCellCtx,
    }),
    [baseCtx, rangeCellCtx],
  );

  return <MemoizedInnerRangeCalendarMonthCell {...props} ref={ref} ctx={ctx} />;
});

export namespace RangeCalendarMonthCell {
  export interface State extends RangeCellState {}

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      useBaseCalendarMonthCell.Parameters {}
}

interface InnerRangeCalendarMonthCellProps extends RangeCalendarMonthCell.Props {
  /**
   * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
   */
  ctx: InnerRangeCalendarMonthCellPropsContext;
}

interface InnerRangeCalendarMonthCellPropsContext
  extends useBaseCalendarMonthCell.Context,
    useRangeCell.Context {}

export { RangeCalendarMonthCell };
