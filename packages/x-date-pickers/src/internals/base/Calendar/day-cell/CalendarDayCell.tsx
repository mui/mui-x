'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDayCellWrapper } from '../../utils/base-calendar/day-cell/useBaseCalendarDayCellWrapper';
import { useBaseCalendarDayCell } from '../../utils/base-calendar/day-cell/useBaseCalendarDayCell';
import { CustomStyleHookMapping } from '../../base-utils/getStyleHookProps';
import { CalendarDayCellDataAttributes } from './CalendarDayCellDataAttributes';

const customStyleHookMapping: CustomStyleHookMapping<CalendarDayCell.State> = {
  selected(value) {
    return value ? { [CalendarDayCellDataAttributes.selected]: '' } : null;
  },
  disabled(value) {
    return value ? { [CalendarDayCellDataAttributes.disabled]: '' } : null;
  },
  invalid(value) {
    return value ? { [CalendarDayCellDataAttributes.invalid]: '' } : null;
  },
  current(value) {
    return value ? { [CalendarDayCellDataAttributes.current]: '' } : null;
  },
  outsideMonth(value) {
    return value ? { [CalendarDayCellDataAttributes.outsideMonth]: '' } : null;
  },
};

const InnerCalendarDayCell = React.forwardRef(function CalendarDayGrid(
  props: InnerCalendarDayCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...otherProps } = props;
  const { getDayCellProps } = useBaseCalendarDayCell({ value, ctx });

  const state: CalendarDayCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      outsideMonth: ctx.isOutsideCurrentMonth,
      current: ctx.isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, ctx.isOutsideCurrentMonth, ctx.isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getDayCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerCalendarDayCell = React.memo(InnerCalendarDayCell);

const CalendarDayCell = React.forwardRef(function CalendarDayCell(
  props: CalendarDayCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useBaseCalendarDayCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerCalendarDayCell ref={ref} {...props} ctx={ctx} />;
});

export namespace CalendarDayCell {
  export interface State {
    /**
     * Whether the day is selected.
     */
    selected: boolean;
    /**
     * Whether the day is disabled.
     */
    disabled: boolean;
    /**
     * Whether the day is invalid.
     */
    invalid: boolean;
    /**
     * Whether the day contains the current date.
     */
    current: boolean;
    /**
     * Whether the day is outside the month rendered by the day grid wrapping it.
     */
    outsideMonth: boolean;
  }

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      Omit<useBaseCalendarDayCell.Parameters, 'ctx'> {}
}

interface InnerCalendarDayCellProps
  extends Omit<BaseUIComponentProps<'button', CalendarDayCell.State>, 'value'>,
    useBaseCalendarDayCell.Parameters {}

export { CalendarDayCell };
