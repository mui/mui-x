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
import { CustomStyleHookMapping } from '../../utils/getStyleHookProps';
import { CalendarDaysCellDataAttributes } from './CalendarDaysCellDataAttributes';

const customStyleHookMapping: CustomStyleHookMapping<CalendarDaysCell.State> = {
  selected(value) {
    return value ? { [CalendarDaysCellDataAttributes.selected]: '' } : null;
  },
  disabled(value) {
    return value ? { [CalendarDaysCellDataAttributes.disabled]: '' } : null;
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
  const { getDaysCellProps, isCurrent } = useCalendarDaysCell({ value, ctx });

  const state: CalendarDaysCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      outsideMonth: ctx.isOutsideCurrentMonth,
      current: isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isOutsideCurrentMonth, isCurrent],
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

  const isDateInvalid = rootContext.isDateInvalid;
  const isInvalid = React.useMemo(() => isDateInvalid(props.value), [props.value, isDateInvalid]);

  const isDisabled = React.useMemo(() => {
    if (rootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [rootContext.disabled, isInvalid]);

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
      isInvalid,
      isTabbable,
      isOutsideCurrentMonth,
      selectDay: monthsListContext.selectDay,
    }),
    [
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isOutsideCurrentMonth,
      monthsListContext.selectDay,
      colIndex,
    ],
  );

  return <MemoizedInnerCalendarDaysCell ref={mergedRef} {...props} ctx={ctx} />;
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
      Omit<useCalendarDaysCell.Parameters, 'ctx'> {}
}

interface InnerCalendarDaysCellProps
  extends Omit<BaseUIComponentProps<'button', CalendarDaysCell.State>, 'value'>,
    useCalendarDaysCell.Parameters {}

export { CalendarDaysCell };
