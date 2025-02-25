import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { PickerValidDate } from '../../../../../models';
import { useNow, useUtils } from '../../../../hooks/useUtils';
import { findClosestEnabledDate } from '../../../../utils/date-utils';
import { useCompositeListItem } from '../../../composite/list/useCompositeListItem';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import { useBaseCalendarMonthCell } from './useBaseCalendarMonthCell';
import { useBaseCalendarMonthCollectionContext } from '../utils/BaseCalendarMonthCollectionContext';

export function useBaseCalendarMonthCellWrapper(
  parameters: useBaseCalendarMonthCellWrapper.Parameters,
): useBaseCalendarMonthCellWrapper.ReturnValue {
  const { forwardedRef, value } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseMonthListOrGridContext = useBaseCalendarMonthCollectionContext();
  const { ref: listItemRef } = useCompositeListItem();
  const utils = useUtils();
  const now = useNow(baseRootContext.timezone);
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () => baseRootContext.selectedDates.some((date) => utils.isSameMonth(date, value)),
    [baseRootContext.selectedDates, value, utils],
  );

  const isCurrent = React.useMemo(() => utils.isSameMonth(value, utils.date()), [utils, value]);

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

    const monthToValidate = utils.startOfMonth(value);

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
  }, [baseRootContext.dateValidationProps, value, now, utils]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [baseRootContext.disabled, isInvalid]);

  const canCellBeTabbed = baseMonthListOrGridContext.canCellBeTabbed;
  const isTabbable = React.useMemo(() => canCellBeTabbed(value), [canCellBeTabbed, value]);

  const selectMonth = useEventCallback((date: PickerValidDate) => {
    if (baseRootContext.readOnly) {
      return;
    }

    const newCleanValue = utils.setMonth(baseRootContext.currentDate, utils.getMonth(date));

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
      baseRootContext.selectDate(closestEnabledDate, { section: 'month' });
    }
  });

  const ctx = React.useMemo<useBaseCalendarMonthCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isCurrent,
      selectMonth,
    }),
    [isSelected, isDisabled, isInvalid, isTabbable, isCurrent, selectMonth],
  );

  return { ref: mergedRef, ctx };
}

export namespace useBaseCalendarMonthCellWrapper {
  export interface Parameters extends Pick<useBaseCalendarMonthCell.Parameters, 'value'> {
    /**
     * The ref forwarded by the parent component.
     */
    forwardedRef: React.ForwardedRef<HTMLButtonElement>;
  }

  export interface ReturnValue {
    /**
     * The ref to forward to the component.
     */
    ref: React.RefCallback<HTMLButtonElement> | null;
    /**
     * The memoized context to forward to the memoized component so that it does not need to subscribe to any context.
     */
    ctx: useBaseCalendarMonthCell.Context;
  }
}
