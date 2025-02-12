'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useBaseCalendarMonthsCell } from '../../utils/base-calendar/months-cell/useBaseCalendarMonthsCell';
import { useBaseCalendarMonthsCellWrapper } from '../../utils/base-calendar/months-cell/useBaseCalendarMonthsCellWrapper';

const InnerCalendarMonthsCell = React.forwardRef(function InnerCalendarMonthsCell(
  props: InnerCalendarMonthsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getMonthsCellProps } = useBaseCalendarMonthsCell({ value, format, ctx });

  const state: CalendarMonthsCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      current: ctx.isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, ctx.isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthsCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarMonthsCell = React.memo(InnerCalendarMonthsCell);

const CalendarMonthsCell = React.forwardRef(function CalendarMonthsCell(
  props: CalendarMonthsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useBaseCalendarMonthsCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerCalendarMonthsCell {...props} ref={ref} ctx={ctx} />;
});

export namespace CalendarMonthsCell {
  export interface State {
    /**
     * Whether the month is selected.
     */
    selected: boolean;
    /**
     * Whether the month is disabled.
     */
    disabled: boolean;
    /**
     * Whether the month is invalid.
     */
    invalid: boolean;
    /**
     * Whether the month contains the current date.
     */
    current: boolean;
  }

  export interface Props
    extends Omit<useBaseCalendarMonthsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerCalendarMonthsCellProps
  extends useBaseCalendarMonthsCell.Parameters,
    Omit<BaseUIComponentProps<'button', CalendarMonthsCell.State>, 'value'> {}

export { CalendarMonthsCell };
