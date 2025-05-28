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
import { useBaseCalendarDayCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-cell/useBaseCalendarDayCell';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarDayCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/day-cell/useBaseCalendarDayCellWrapper';
import { RangeCalendarDayCellDataAttributes } from './RangeCalendarDayCellDataAttributes';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';
import { useRangeCell } from '../utils/useRangeCell';
import { useRangeCellWrapper } from '../utils/useRangeCellWrapper';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarDayCell.State> = {
  ...rangeCellStyleHookMapping,
  outsideMonth(value) {
    return value ? { [RangeCalendarDayCellDataAttributes.outsideMonth]: '' } : null;
  },
};

const InnerRangeCalendarDayCell = React.forwardRef(function RangeCalendarDayGrid(
  componentProps: InnerRangeCalendarDayCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...elementProps } = componentProps;

  const { props } = useBaseCalendarDayCell({ value, ctx });
  const rangeCellProps = useRangeCell({ ctx, value, section: 'day' });

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

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [props, rangeCellProps, elementProps],
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarDayCell = React.memo(InnerRangeCalendarDayCell);

const RangeCalendarDayCell = React.forwardRef(function RangeCalendarDayCell(
  props: RangeCalendarDayCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref: baseRef, ctx: baseCtx } = useBaseCalendarDayCellWrapper({
    value: props.value,
    forwardedRef,
  });

  const { cellRef, ctx: rangeCellCtx } = useRangeCellWrapper({
    value: props.value,
    section: 'day',
  });

  const ref = useForkRef(baseRef, cellRef);

  const ctx = React.useMemo<InnerRangeCalendarDayCellContext>(
    () => ({
      ...baseCtx,
      ...rangeCellCtx,
    }),
    [baseCtx, rangeCellCtx],
  );

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
      useBaseCalendarDayCell.PublicParameters {}
}

interface InnerRangeCalendarDayCellProps extends RangeCalendarDayCell.Props {
  /**
   * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
   */
  ctx: InnerRangeCalendarDayCellContext;
}

interface InnerRangeCalendarDayCellContext
  extends useBaseCalendarDayCell.Context,
    useRangeCell.Context {}

export { RangeCalendarDayCell };
