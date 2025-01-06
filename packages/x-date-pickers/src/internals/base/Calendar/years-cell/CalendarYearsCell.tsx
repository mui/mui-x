'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarYearsCell } from './useCalendarYearsCell';
import { BaseUIComponentProps } from '../../utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useCalendarYearsListContext } from '../years-list/CalendarYearsListContext';

const InnerCalendarYearsCell = React.forwardRef(function InnerCalendarYearsCell(
  props: InnerCalendarYearsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getYearCellProps, isCurrent } = useCalendarYearsCell({ value, format, ctx });

  const state: CalendarYearsCell.State = React.useMemo(
    () => ({ selected: ctx.isSelected, current: isCurrent }),
    [ctx.isSelected, isCurrent],
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

const MemoizedInnerCalendarYearsCell = React.memo(InnerCalendarYearsCell);

const CalendarYearsCell = React.forwardRef(function CalendarsYearCell(
  props: CalendarYearsCell.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const calendarRootContext = useCalendarRootContext();
  const calendarYearsListContext = useCalendarYearsListContext();
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const now = useNow(calendarRootContext.timezone);
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () =>
      calendarRootContext.value == null
        ? false
        : utils.isSameYear(calendarRootContext.value, props.value),
    [calendarRootContext.value, props.value, utils],
  );

  const isDisabled = React.useMemo(() => {
    if (calendarRootContext.disabled) {
      return true;
    }

    if (calendarRootContext.validationProps.disablePast && utils.isBeforeYear(props.value, now)) {
      return true;
    }
    if (calendarRootContext.validationProps.disableFuture && utils.isAfterYear(props.value, now)) {
      return true;
    }
    if (
      calendarRootContext.validationProps.minDate &&
      utils.isBeforeYear(props.value, calendarRootContext.validationProps.minDate)
    ) {
      return true;
    }
    if (
      calendarRootContext.validationProps.maxDate &&
      utils.isAfterYear(props.value, calendarRootContext.validationProps.maxDate)
    ) {
      return true;
    }

    if (!calendarRootContext.validationProps.shouldDisableYear) {
      return false;
    }

    const yearToValidate = utils.startOfYear(props.value);
    return calendarRootContext.validationProps.shouldDisableYear(yearToValidate);
  }, [calendarRootContext.disabled, calendarRootContext.validationProps, props.value, now, utils]);

  const isTabbable = React.useMemo(
    () =>
      utils.isValid(calendarRootContext.value)
        ? isSelected
        : utils.isSameYear(calendarRootContext.referenceDate, props.value),
    [utils, calendarRootContext.value, calendarRootContext.referenceDate, isSelected, props.value],
  );

  const ctx = React.useMemo<useCalendarYearsCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isTabbable,
      selectYear: calendarYearsListContext.selectYear,
    }),
    [isSelected, isDisabled, isTabbable, calendarYearsListContext.selectYear],
  );

  return <MemoizedInnerCalendarYearsCell ref={mergedRef} {...props} ctx={ctx} />;
});

export namespace CalendarYearsCell {
  export interface State {
    selected: boolean;
  }

  export interface Props
    extends Omit<useCalendarYearsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerCalendarYearsCellProps
  extends useCalendarYearsCell.Parameters,
    Omit<BaseUIComponentProps<'button', CalendarYearsCell.State>, 'value'> {}

export { CalendarYearsCell };
