'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { PickerValidDate } from '../../../../models';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { findClosestEnabledDate } from '../../../utils/date-utils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarYearsCell } from './useCalendarYearsCell';
import { BaseUIComponentProps } from '../../utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';

const InnerCalendarYearsCell = React.forwardRef(function InnerCalendarYearsCell(
  props: InnerCalendarYearsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getYearCellProps, isCurrent } = useCalendarYearsCell({ value, format, ctx });

  const state: CalendarYearsCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      current: isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, isCurrent],
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
  const rootContext = useCalendarRootContext();
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const now = useNow(rootContext.timezone);
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () => (rootContext.value == null ? false : utils.isSameYear(rootContext.value, props.value)),
    [rootContext.value, props.value, utils],
  );

  const isInvalid = React.useMemo(() => {
    if (rootContext.validationProps.disablePast && utils.isBeforeYear(props.value, now)) {
      return true;
    }
    if (rootContext.validationProps.disableFuture && utils.isAfterYear(props.value, now)) {
      return true;
    }
    if (
      rootContext.validationProps.minDate &&
      utils.isBeforeYear(props.value, rootContext.validationProps.minDate)
    ) {
      return true;
    }
    if (
      rootContext.validationProps.maxDate &&
      utils.isAfterYear(props.value, rootContext.validationProps.maxDate)
    ) {
      return true;
    }

    if (!rootContext.validationProps.shouldDisableYear) {
      return false;
    }

    const yearToValidate = utils.startOfYear(props.value);

    return rootContext.validationProps.shouldDisableYear(yearToValidate);
  }, [rootContext.validationProps, props.value, now, utils]);

  const isDisabled = React.useMemo(() => {
    if (rootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [rootContext.disabled, isInvalid]);

  const isTabbable = React.useMemo(
    () =>
      utils.isValid(rootContext.value)
        ? isSelected
        : utils.isSameYear(rootContext.referenceDate, props.value),
    [utils, rootContext.value, rootContext.referenceDate, isSelected, props.value],
  );

  const selectYear = useEventCallback((newValue: PickerValidDate) => {
    if (rootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setYear(
      rootContext.value ?? rootContext.referenceDate,
      utils.getYear(newValue),
    );

    const startOfYear = utils.startOfYear(newCleanValue);
    const endOfYear = utils.endOfYear(newCleanValue);

    const closestEnabledDate = rootContext.isDateInvalid(newCleanValue)
      ? findClosestEnabledDate({
          utils,
          date: newCleanValue,
          minDate: utils.isBefore(rootContext.validationProps.minDate, startOfYear)
            ? startOfYear
            : rootContext.validationProps.minDate,
          maxDate: utils.isAfter(rootContext.validationProps.maxDate, endOfYear)
            ? endOfYear
            : rootContext.validationProps.maxDate,
          disablePast: rootContext.validationProps.disablePast,
          disableFuture: rootContext.validationProps.disableFuture,
          isDateDisabled: rootContext.isDateInvalid,
          timezone: rootContext.timezone,
        })
      : newCleanValue;

    if (closestEnabledDate) {
      rootContext.setValue(closestEnabledDate, { section: 'year' });
    }
  });

  const ctx = React.useMemo<useCalendarYearsCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      selectYear,
    }),
    [isSelected, isDisabled, isInvalid, isTabbable, selectYear],
  );

  return <MemoizedInnerCalendarYearsCell ref={mergedRef} {...props} ctx={ctx} />;
});

export namespace CalendarYearsCell {
  export interface State {
    /**
     * Whether the year is selected.
     */
    selected: boolean;
    /**
     * Whether the year is disabled.
     */
    disabled: boolean;
    /**
     * Whether the year is invalid.
     */
    invalid: boolean;
    /**
     * Whether the year contains the current date.
     */
    current: boolean;
  }

  export interface Props
    extends Omit<useCalendarYearsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerCalendarYearsCellProps
  extends useCalendarYearsCell.Parameters,
    Omit<BaseUIComponentProps<'button', CalendarYearsCell.State>, 'value'> {}

export { CalendarYearsCell };
