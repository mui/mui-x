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
  const rootContext = useCalendarRootContext();
  const monthsListContext = useCalendarDaysGridContext();
  const { ref: listItemRef, index: colIndex } = useCompositeListItem();
  const utils = useUtils();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () => (rootContext.value == null ? false : utils.isSameDay(rootContext.value, props.value)),
    [rootContext.value, props.value, utils],
  );

  const isOutsideCurrentMonth = React.useMemo(
    () =>
      monthsListContext.currentMonth == null
        ? false
        : !utils.isSameMonth(monthsListContext.currentMonth, props.value),
    [monthsListContext.currentMonth, props.value, utils],
  );

  const isDateDisabled = rootContext.isDateDisabled;
  const isDisabled = React.useMemo(() => {
    if (rootContext.disabled) {
      return true;
    }

    return isDateDisabled(props.value);
  }, [rootContext.disabled, isDateDisabled, props.value]);

  const isTabbable = React.useMemo(
    () =>
      monthsListContext.tabbableDay == null
        ? false
        : utils.isSameDay(monthsListContext.tabbableDay, props.value),
    [utils, monthsListContext.tabbableDay, props.value],
  );

  const ctx = React.useMemo<useCalendarDaysCell.Context>(
    () => ({
      colIndex,
      isSelected,
      isDisabled,
      isTabbable,
      isOutsideCurrentMonth,
      selectDay: monthsListContext.selectDay,
    }),
    [
      isSelected,
      isDisabled,
      isTabbable,
      isOutsideCurrentMonth,
      monthsListContext.selectDay,
      colIndex,
    ],
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
