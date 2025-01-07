'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { PickerValidDate } from '../../../../models';
import { useNow, useUtils } from '../../../hooks/useUtils';
import { findClosestEnabledDate } from '../../../utils/date-utils';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useCalendarRootContext } from '../root/CalendarRootContext';
import { useCalendarMonthsCell } from './useCalendarMonthsCell';
import { BaseUIComponentProps } from '../../utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';

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
      invlid: ctx.isInvalid,
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
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const now = useNow(rootContext.timezone);
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () => (rootContext.value == null ? false : utils.isSameMonth(rootContext.value, props.value)),
    [rootContext.value, props.value, utils],
  );

  const isInvalid = React.useMemo(() => {
    const firstEnabledMonth = utils.startOfMonth(
      rootContext.validationProps.disablePast &&
        utils.isAfter(now, rootContext.validationProps.minDate)
        ? now
        : rootContext.validationProps.minDate,
    );

    const lastEnabledMonth = utils.startOfMonth(
      rootContext.validationProps.disableFuture &&
        utils.isBefore(now, rootContext.validationProps.maxDate)
        ? now
        : rootContext.validationProps.maxDate,
    );

    const monthToValidate = utils.startOfMonth(props.value);

    if (utils.isBefore(monthToValidate, firstEnabledMonth)) {
      return true;
    }

    if (utils.isAfter(monthToValidate, lastEnabledMonth)) {
      return true;
    }

    if (!rootContext.validationProps.shouldDisableMonth) {
      return false;
    }

    return rootContext.validationProps.shouldDisableMonth(monthToValidate);
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
        : utils.isSameMonth(rootContext.referenceDate, props.value),
    [utils, rootContext.value, rootContext.referenceDate, isSelected, props.value],
  );

  const selectMonth = useEventCallback((newValue: PickerValidDate) => {
    if (rootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setMonth(
      rootContext.value ?? rootContext.referenceDate,
      utils.getMonth(newValue),
    );

    const startOfMonth = utils.startOfMonth(newCleanValue);
    const endOfMonth = utils.endOfMonth(newCleanValue);

    const closestEnabledDate = rootContext.isDateInvalid(newCleanValue)
      ? findClosestEnabledDate({
          utils,
          date: newCleanValue,
          minDate: utils.isBefore(rootContext.validationProps.minDate, startOfMonth)
            ? startOfMonth
            : rootContext.validationProps.minDate,
          maxDate: utils.isAfter(rootContext.validationProps.maxDate, endOfMonth)
            ? endOfMonth
            : rootContext.validationProps.maxDate,
          disablePast: rootContext.validationProps.disablePast,
          disableFuture: rootContext.validationProps.disableFuture,
          isDateDisabled: rootContext.isDateInvalid,
          timezone: rootContext.timezone,
        })
      : newCleanValue;

    if (closestEnabledDate) {
      rootContext.setVisibleDate(closestEnabledDate, true);
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
