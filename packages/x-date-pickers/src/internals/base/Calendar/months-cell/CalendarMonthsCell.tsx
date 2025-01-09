'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { PickerValidDate } from '../../../../models';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { findClosestEnabledDate } from '../../../utils/date-utils';
import { useComponentRenderer } from '../../base-utils/useComponentRenderer';
import { BaseUIComponentProps } from '../../base-utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useBaseCalendarRootContext } from '../../utils/base-calendar/root/BaseCalendarRootContext';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarMonthsCell } from './useCalendarMonthsCell';

const InnerCalendarMonthsCell = React.forwardRef(function InnerCalendarMonthsCell(
  props: InnerCalendarMonthsCellProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, value, format, ctx, ...otherProps } = props;
  const { getMonthsCellProps, isCurrent } = useCalendarMonthsCell({ value, format, ctx });

  const state: CalendarMonthsCell.State = React.useMemo(
    () => ({
      selected: ctx.isSelected,
      disabled: ctx.isDisabled,
      invalid: ctx.isInvalid,
      current: isCurrent,
    }),
    [ctx.isSelected, ctx.isDisabled, ctx.isInvalid, isCurrent],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getMonthsCellProps,
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
  const rootContext = useCalendarRootContext();
  const baseRootContext = useBaseCalendarRootContext();
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const now = useNow(baseRootContext.timezone);
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () => (rootContext.value == null ? false : utils.isSameMonth(rootContext.value, props.value)),
    [rootContext.value, props.value, utils],
  );

  const isInvalid = React.useMemo(() => {
    const firstEnabledMonth = utils.startOfMonth(
      baseRootContext.dateValidationProps.disablePast &&
        utils.isAfter(now, baseRootContext.dateValidationProps.minDate)
        ? now
        : baseRootContext.dateValidationProps.minDate,
    );

    const lastEnabledMonth = utils.startOfMonth(
      baseRootContext.dateValidationProps.disableFuture &&
        utils.isBefore(now, baseRootContext.dateValidationProps.maxDate)
        ? now
        : baseRootContext.dateValidationProps.maxDate,
    );

    const monthToValidate = utils.startOfMonth(props.value);

    if (utils.isBefore(monthToValidate, firstEnabledMonth)) {
      return true;
    }

    if (utils.isAfter(monthToValidate, lastEnabledMonth)) {
      return true;
    }

    if (!baseRootContext.dateValidationProps.shouldDisableMonth) {
      return false;
    }

    return baseRootContext.dateValidationProps.shouldDisableMonth(monthToValidate);
  }, [baseRootContext.dateValidationProps, props.value, now, utils]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [baseRootContext.disabled, isInvalid]);

  const isTabbable = React.useMemo(
    () =>
      utils.isValid(rootContext.value)
        ? isSelected
        : utils.isSameMonth(rootContext.referenceValue, props.value),
    [utils, rootContext.value, rootContext.referenceValue, isSelected, props.value],
  );

  const selectMonth = useEventCallback((newValue: PickerValidDate) => {
    if (baseRootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setMonth(
      rootContext.value ?? rootContext.referenceValue,
      utils.getMonth(newValue),
    );

    const startOfMonth = utils.startOfMonth(newCleanValue);
    const endOfMonth = utils.endOfMonth(newCleanValue);

    const closestEnabledDate = baseRootContext.isDateInvalid(newCleanValue)
      ? findClosestEnabledDate({
          utils,
          date: newCleanValue,
          minDate: utils.isBefore(baseRootContext.dateValidationProps.minDate, startOfMonth)
            ? startOfMonth
            : baseRootContext.dateValidationProps.minDate,
          maxDate: utils.isAfter(baseRootContext.dateValidationProps.maxDate, endOfMonth)
            ? endOfMonth
            : baseRootContext.dateValidationProps.maxDate,
          disablePast: baseRootContext.dateValidationProps.disablePast,
          disableFuture: baseRootContext.dateValidationProps.disableFuture,
          isDateDisabled: baseRootContext.isDateInvalid,
          timezone: baseRootContext.timezone,
        })
      : newCleanValue;

    if (closestEnabledDate) {
      baseRootContext.setVisibleDate(closestEnabledDate, true);
      rootContext.setValue(closestEnabledDate, { section: 'month' });
    }
  });

  const ctx = React.useMemo<useCalendarMonthsCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      selectMonth,
    }),
    [isSelected, isDisabled, isInvalid, isTabbable, selectMonth],
  );

  return <MemoizedInnerCalendarMonthsCell {...props} ref={mergedRef} ctx={ctx} />;
});

export namespace CalendarMonthsCell {
  export interface State {
    /**
     * Whether the month is selected.
     */
    selected: boolean;
    /**
     * Whether the month is disabled.
     */
    disabled: boolean;
    /**
     * Whether the month is invalid.
     */
    invalid: boolean;
    /**
     * Whether the month contains the current date.
     */
    current: boolean;
  }

  export interface Props
    extends Omit<useCalendarMonthsCell.Parameters, 'ctx'>,
      Omit<BaseUIComponentProps<'button', State>, 'value'> {}
}

interface InnerCalendarMonthsCellProps
  extends useCalendarMonthsCell.Parameters,
    Omit<BaseUIComponentProps<'button', CalendarMonthsCell.State>, 'value'> {}

export { CalendarMonthsCell };
