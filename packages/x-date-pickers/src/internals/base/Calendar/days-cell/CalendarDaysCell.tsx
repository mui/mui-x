'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useUtils } from '../../../hooks/useUtils';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { useBaseCalendarDaysGridContext } from '../../utils/base-calendar/days-grid/BaseCalendarDaysGridContext';
import { useCalendarDaysCell } from './useCalendarDaysCell';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { CustomStyleHookMapping } from '../../base-utils/getStyleHookProps';
import { useBaseCalendarRootContext } from '../../utils/base-calendar/root/BaseCalendarRootContext';
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
  const rootContext = useCalendarRootContext();
  const baseRootContext = useBaseCalendarRootContext();
  const baseDaysGridContext = useBaseCalendarDaysGridContext();
  const { ref: listItemRef, index: colIndex } = useCompositeListItem();
  const utils = useUtils();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () => (rootContext.value == null ? false : utils.isSameDay(rootContext.value, props.value)),
    [rootContext.value, props.value, utils],
  );

  const isOutsideCurrentMonth = React.useMemo(
    () =>
      baseDaysGridContext.currentMonth == null
        ? false
        : !utils.isSameMonth(baseDaysGridContext.currentMonth, props.value),
    [baseDaysGridContext.currentMonth, props.value, utils],
  );

  const isDateInvalid = baseRootContext.isDateInvalid;
  const isInvalid = React.useMemo(() => isDateInvalid(props.value), [props.value, isDateInvalid]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [baseRootContext.disabled, isInvalid]);

  const isTabbable = React.useMemo(
    () => baseDaysGridContext.tabbableDays.some((day) => utils.isSameDay(day, props.value)),
    [utils, baseDaysGridContext.tabbableDays, props.value],
  );

  const ctx = React.useMemo<useCalendarDaysCell.Context>(
    () => ({
      colIndex,
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isOutsideCurrentMonth,
      selectDay: baseDaysGridContext.selectDay,
    }),
    [
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isOutsideCurrentMonth,
      baseDaysGridContext.selectDay,
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
      Omit<useCalendarDaysCell.Parameters, 'ctx'> {}
}

interface InnerCalendarDaysCellProps
  extends Omit<BaseUIComponentProps<'button', CalendarDaysCell.State>, 'value'>,
    useCalendarDaysCell.Parameters {}

export { CalendarDaysCell };
