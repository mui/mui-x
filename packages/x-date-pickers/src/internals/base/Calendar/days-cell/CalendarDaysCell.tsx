'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDaysCellWrapper } from '../../utils/base-calendar/days-cell/useBaseCalendarDaysCellWrapper';
import { useBaseCalendarDaysCell } from '../../utils/base-calendar/days-cell/useBaseCalendarDaysCell';
import { CustomStyleHookMapping } from '../../base-utils/getStyleHookProps';
import { CalendarDaysCellDataAttributes } from './CalendarDaysCellDataAttributes';

const customStyleHookMapping: CustomStyleHookMapping<CalendarDaysCell.State> = {
  selected(value) {
    return value ? { [CalendarDaysCellDataAttributes.selected]: '' } : null;
  },
  disabled(value) {
    return value ? { [CalendarDaysCellDataAttributes.disabled]: '' } : null;
  },
  invalid(value) {
    return value ? { [CalendarDaysCellDataAttributes.invalid]: '' } : null;
  },
  current(value) {
    return value ? { [CalendarDaysCellDataAttributes.current]: '' } : null;
  },
  outsideMonth(value) {
    return value ? { [CalendarDaysCellDataAttributes.outsideMonth]: '' } : null;
  },
};

const InnerCalendarDaysCell = React.forwardRef(function CalendarDaysGrid(
  props: InnerCalendarDaysCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...otherProps } = props;
  const { getDaysCellProps, isCurrent } = useBaseCalendarDaysCell({ value, ctx });

  const state: CalendarDaysCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      outsideMonth: ctx.isOutsideCurrentMonth,
      current: isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, ctx.isOutsideCurrentMonth, isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  return renderElement();
});

const MemoizedInnerCalendarDaysCell = React.memo(InnerCalendarDaysCell);

const CalendarDaysCell = React.forwardRef(function CalendarDaysCell(
  props: CalendarDaysCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ref, ctx } = useBaseCalendarDaysCellWrapper({ value: props.value, forwardedRef });

  return <MemoizedInnerCalendarDaysCell ref={ref} {...props} ctx={ctx} />;
});

export namespace CalendarDaysCell {
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
      Omit<useBaseCalendarDaysCell.Parameters, 'ctx'> {}
}

interface InnerCalendarDaysCellProps
  extends Omit<BaseUIComponentProps<'button', CalendarDaysCell.State>, 'value'>,
    useBaseCalendarDaysCell.Parameters {}

export { CalendarDaysCell };
