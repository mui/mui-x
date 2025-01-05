'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useUtils } from '../../../hooks/useUtils';
import { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarDaysGridContext } from '../days-grid/CalendarDaysGridContext';
import { useCalendarDaysCell } from './useCalendarDaysCell';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';

const InnerCalendarDaysCell = React.forwardRef(function CalendarDaysGrid(
  props: InnerCalendarDaysCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, ctx, ...otherProps } = props;
  const { getDaysCellProps, isCurrent } = useCalendarDaysCell({ value, ctx });

  const state: CalendarDaysCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      outsideMonth: ctx.isOutsideCurrentMonth,
      current: isCurrent,
    }),
    [ctx.isSelected, ctx.isOutsideCurrentMonth, isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getDaysCellProps,
    render: render ?? 'button',
    ref: forwardedRef,
    className,
    state,
    extraProps: otherProps,
  });

  return renderElement();
});

const MemoizedInnerCalendarDaysCell = React.memo(InnerCalendarDaysCell);

const CalendarDaysCell = React.forwardRef(function CalendarDaysCell(
  props: CalendarDaysCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const calendarRootContext = useCalendarRootContext();
  const calendarMonthsListContext = useCalendarDaysGridContext();
  const { ref: listItemRef, index: colIndex } = useCompositeListItem();
  const utils = useUtils();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () =>
      calendarRootContext.value == null
        ? false
        : utils.isSameDay(calendarRootContext.value, props.value),
    [calendarRootContext.value, props.value, utils],
  );

  const isOutsideCurrentMonth = React.useMemo(
    () =>
      calendarMonthsListContext.currentMonth == null
        ? false
        : !utils.isSameMonth(calendarMonthsListContext.currentMonth, props.value),
    [calendarMonthsListContext.currentMonth, props.value, utils],
  );

  const isDateDisabled = calendarRootContext.isDateDisabled;
  const isDisabled = React.useMemo(
    () => calendarRootContext.disabled || isDateDisabled(props.value),
    [calendarRootContext.disabled, isDateDisabled, props.value],
  );

  const ctx = React.useMemo<useCalendarDaysCell.Context>(
    () => ({
      colIndex,
      isSelected,
      isDisabled,
      isOutsideCurrentMonth,
      selectDay: calendarMonthsListContext.selectDay,
    }),
    [isSelected, isDisabled, isOutsideCurrentMonth, calendarMonthsListContext.selectDay, colIndex],
  );

  return <MemoizedInnerCalendarDaysCell ref={mergedRef} {...props} ctx={ctx} />;
});

export namespace CalendarDaysCell {
  export interface State {}

  export interface Props
    extends Omit<BaseUIComponentProps<'button', State>, 'value'>,
      Omit<useCalendarDaysCell.Parameters, 'ctx'> {}
}

interface InnerCalendarDaysCellProps
  extends Omit<BaseUIComponentProps<'button', CalendarDaysCell.State>, 'value'>,
    useCalendarDaysCell.Parameters {}

export { CalendarDaysCell };
