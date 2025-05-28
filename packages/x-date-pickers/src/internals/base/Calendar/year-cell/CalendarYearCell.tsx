'use client';
import * as React from 'react';
import { useRenderElement } from '../../base-utils/useRenderElement';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useBaseCalendarYearCell } from '../../utils/base-calendar/year-cell/useBaseCalendarYearCell';
import { useBaseCalendarYearCellWrapper } from '../../utils/base-calendar/year-cell/useBaseCalendarYearCellWrapper';

const InnerCalendarYearCell = React.forwardRef(function InnerCalendarYearCell(
  componentProps: InnerCalendarYearCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...elementProps } = componentProps;
  const { props } = useBaseCalendarYearCell({ value, format, ctx });

  const state: CalendarYearCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      current: ctx.isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, ctx.isCurrent],
  );

  const renderElement = useRenderElement('button', componentProps, {
    state,
    ref: forwardedRef,
    props: [props, elementProps],
  });

  return renderElement();
});

const MemoizedInnerCalendarYearCell = React.memo(InnerCalendarYearCell);

const CalendarYearCell = React.forwardRef(function CalendarsYearCell(
  props: CalendarYearCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useBaseCalendarYearCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerCalendarYearCell ref={ref} {...props} ctx={ctx} />;
});

export namespace CalendarYearCell {
  export interface State {
    /**
     * Whether the year is selected.
     */
    selected: boolean;
    /**
     * Whether the year is disabled.
     */
    disabled: boolean;
    /**
     * Whether the year is invalid.
     */
    invalid: boolean;
    /**
     * Whether the year contains the current date.
     */
    current: boolean;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      useBaseCalendarYearCell.PublicParameters {}
}

interface InnerCalendarYearCellProps extends CalendarYearCell.Props {
  /**
   * The memoized context forwarded by the wrapper component so that this component does not need to subscribe to any context.
   */
  ctx: InnerRangeCalendarMonthCellContext;
}

interface InnerRangeCalendarMonthCellContext extends useBaseCalendarYearCell.Context {}

export { CalendarYearCell };
