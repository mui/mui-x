'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useBaseCalendarYearCell } from '../../utils/base-calendar/year-cell/useBaseCalendarYearCell';
import { useBaseCalendarYearCellWrapper } from '../../utils/base-calendar/year-cell/useBaseCalendarYearCellWrapper';

const InnerCalendarYearCell = React.forwardRef(function InnerCalendarYearCell(
  props: InnerCalendarYearCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getYearCellProps } = useBaseCalendarYearCell({ value, format, ctx });

  const state: CalendarYearCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      current: ctx.isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, ctx.isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getYearCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
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

namespace CalendarYearCell {
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
    extends Omit<useBaseCalendarYearCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerCalendarYearCellProps
  extends useBaseCalendarYearCell.Parameters,
    Omit<BaseUIComponentProps<'button', CalendarYearCell.State>, 'value'> {}

export { CalendarYearCell };
