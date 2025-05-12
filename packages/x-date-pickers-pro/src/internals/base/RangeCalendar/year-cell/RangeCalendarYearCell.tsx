'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
// eslint-disable-next-line no-restricted-imports
import { BaseUIComponentProps } from '@mui/x-date-pickers/internals/base/base-utils/types';
// eslint-disable-next-line no-restricted-imports
import { useRenderElement } from '@mui/x-date-pickers/internals/base/base-utils/useRenderElement';
// eslint-disable-next-line no-restricted-imports
import { CustomStyleHookMapping } from '@mui/x-date-pickers/internals/base/base-utils/getStyleHookProps';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearCell } from '@mui/x-date-pickers/internals/base/utils/base-calendar/year-cell/useBaseCalendarYearCell';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarYearCellWrapper } from '@mui/x-date-pickers/internals/base/utils/base-calendar/year-cell/useBaseCalendarYearCellWrapper';
import { useRangeCell } from '../utils/useRangeCell';
import { RangeCellState, rangeCellStyleHookMapping, useRangeCellState } from '../utils/rangeCell';
import { useRangeCellWrapper } from '../utils/useRangeCellWrapper';

const customStyleHookMapping: CustomStyleHookMapping<RangeCalendarYearCell.State> = {
  ...rangeCellStyleHookMapping,
};

const InnerRangeCalendarYearCell = React.forwardRef(function InnerRangeCalendarYearCell(
  componentProps: InnerRangeCalendarYearCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...elementProps } = componentProps;
  const { props } = useBaseCalendarYearCell({ ctx, value });
  const rangeCellProps = useRangeCell({ ctx, value, section: 'year' });

  const state: RangeCalendarYearCell.State = useRangeCellState(ctx);

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: forwardedRef,
    props: [props, rangeCellProps, elementProps],
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerRangeCalendarYearCell = React.memo(InnerRangeCalendarYearCell);

const RangeCalendarYearCell = React.forwardRef(function RangeCalendarsYearCell(
  props: RangeCalendarYearCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref: baseRef, ctx: baseCtx } = useBaseCalendarYearCellWrapper({
    value: props.value,
    forwardedRef,
  });
  const { cellRef, ctx: rangeCellCtx } = useRangeCellWrapper({
    value: props.value,
    section: 'year',
  });
  const ref = useForkRef(baseRef, cellRef);

  const ctx = React.useMemo<InnerRangeCalendarYearCellContext>(
    () => ({
      ...baseCtx,
      ...rangeCellCtx,
    }),
    [baseCtx, rangeCellCtx],
  );

  return <MemoizedInnerRangeCalendarYearCell ref={ref} {...props} ctx={ctx} />;
});

export namespace RangeCalendarYearCell {
  export interface State extends RangeCellState {}

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      useBaseCalendarYearCell.PublicParameters {}
}

interface InnerRangeCalendarYearCellProps extends RangeCalendarYearCell.Props {
  /**
   * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
   */
  ctx: InnerRangeCalendarYearCellContext;
}

interface InnerRangeCalendarYearCellContext
  extends useBaseCalendarYearCell.Context,
    useRangeCell.Context {}

export { RangeCalendarYearCell };
