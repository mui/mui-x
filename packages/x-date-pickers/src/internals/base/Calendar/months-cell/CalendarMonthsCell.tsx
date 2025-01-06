'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarMonthsCell } from './useCalendarMonthsCell';
import { BaseUIComponentProps } from '../../utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useCalendarMonthsListContext } from '../months-list/CalendarMonthsListContext';

const InnerCalendarMonthsCell = React.forwardRef(function InnerCalendarMonthsCell(
  props: InnerCalendarMonthsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getMonthCellProps, isCurrent } = useCalendarMonthsCell({ value, format, ctx });

  const state: CalendarMonthsCell.State = React.useMemo(
    () => ({ selected: ctx.isSelected, current: isCurrent }),
    [ctx.isSelected, isCurrent],
  );

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

const MemoizedInnerCalendarMonthsCell = React.memo(InnerCalendarMonthsCell);

const CalendarMonthsCell = React.forwardRef(function CalendarMonthsCell(
  props: CalendarMonthsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const calendarRootContext = useCalendarRootContext();
  const calendarMonthsListContext = useCalendarMonthsListContext();
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const now = useNow(calendarRootContext.timezone);
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () =>
      calendarRootContext.value == null
        ? false
        : utils.isSameMonth(calendarRootContext.value, props.value),
    [calendarRootContext.value, props.value, utils],
  );

  const isDisabled = React.useMemo(() => {
    if (calendarRootContext.disabled) {
      return true;
    }

    const firstEnabledMonth = utils.startOfMonth(
      calendarRootContext.validationProps.disablePast &&
        utils.isAfter(now, calendarRootContext.validationProps.minDate)
        ? now
        : calendarRootContext.validationProps.minDate,
    );

    const lastEnabledMonth = utils.startOfMonth(
      calendarRootContext.validationProps.disableFuture &&
        utils.isBefore(now, calendarRootContext.validationProps.maxDate)
        ? now
        : calendarRootContext.validationProps.maxDate,
    );

    const monthToValidate = utils.startOfMonth(props.value);

    if (utils.isBefore(monthToValidate, firstEnabledMonth)) {
      return true;
    }

    if (utils.isAfter(monthToValidate, lastEnabledMonth)) {
      return true;
    }

    if (!calendarRootContext.validationProps.shouldDisableMonth) {
      return false;
    }

    return calendarRootContext.validationProps.shouldDisableMonth(monthToValidate);
  }, [calendarRootContext.disabled, calendarRootContext.validationProps, props.value, now, utils]);

  const isTabbable = React.useMemo(
    () =>
      utils.isValid(calendarRootContext.value)
        ? isSelected
        : utils.isSameMonth(calendarRootContext.referenceDate, props.value),
    [utils, calendarRootContext.value, calendarRootContext.referenceDate, isSelected, props.value],
  );

  const ctx = React.useMemo<useCalendarMonthsCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isTabbable,
      selectMonth: calendarMonthsListContext.selectMonth,
    }),
    [isSelected, isDisabled, isTabbable, calendarMonthsListContext.selectMonth],
  );

  return <MemoizedInnerCalendarMonthsCell {...props} ref={mergedRef} ctx={ctx} />;
});

export namespace CalendarMonthsCell {
  export interface State {
    selected: boolean;
  }

  export interface Props
    extends Omit<useCalendarMonthsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerCalendarMonthsCellProps
  extends useCalendarMonthsCell.Parameters,
    Omit<BaseUIComponentProps<'button', CalendarMonthsCell.State>, 'value'> {}

export { CalendarMonthsCell };
