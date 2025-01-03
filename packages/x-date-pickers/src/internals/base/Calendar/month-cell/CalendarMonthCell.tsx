'use client';
import * as React from 'react';
import { useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRender';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarMonthCell } from './useCalendarMonthCell';
import { BaseUIComponentProps } from '../../utils/types';

const InnerCalendarMonthCell = React.forwardRef(function CalendarMonthCell(
  props: InnerCalendarMonthCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...otherProps } = props;
  const { getMonthCellProps } = useCalendarMonthCell({ value, ctx });
  const state = React.useMemo(() => ({ selected: ctx.isSelected }), [ctx.isSelected]);

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarMonthCell = React.memo(InnerCalendarMonthCell);

const CalendarMonthCell = React.forwardRef(function CalendarMonthCell(
  props: CalendarMonthCell.Props,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const calendarRootContext = useCalendarRootContext();
  const utils = useUtils();

  const isSelected = React.useMemo(
    () =>
      calendarRootContext.value == null
        ? false
        : utils.isSameDay(calendarRootContext.value, props.value),
    [calendarRootContext.value, props.value, utils],
  );

  const ctx = React.useMemo<useCalendarMonthCell.Context>(
    () => ({
      isSelected,
      selectMonth: calendarRootContext.selectMonth,
    }),
    [isSelected, calendarRootContext.selectMonth],
  );

  return <MemoizedInnerCalendarMonthCell ref={ref} {...props} ctx={ctx} />;
});

export namespace CalendarMonthCell {
  export interface State {}

  export interface Props
    extends Omit<useCalendarMonthCell.Parameters, 'ctx'>,
      BaseUIComponentProps<'div', State> {}
}

interface InnerCalendarMonthCellProps
  extends useCalendarMonthCell.Parameters,
    BaseUIComponentProps<'div', CalendarMonthCell.State> {}

export { CalendarMonthCell };
