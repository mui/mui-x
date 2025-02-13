import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { useUtils } from '../../../../hooks/useUtils';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import type { useBaseCalendarDaysCell } from './useBaseCalendarDaysCell';
import { useBaseCalendarDaysGridRowContext } from '../days-grid-row/BaseCalendarDaysGridRowContext';
import { useBaseCalendarDaysGridBodyContext } from '../days-grid-body/BaseCalendarDaysGridBodyContext';

export function useBaseCalendarDaysCellWrapper(
  parameters: useBaseCalendarDaysCellWrapper.Parameters,
): useBaseCalendarDaysCellWrapper.ReturnValue {
  const { forwardedRef, value } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseDaysGridBodyContext = useBaseCalendarDaysGridBodyContext();
  const baseDaysGridRowContext = useBaseCalendarDaysGridRowContext();
  const ref = React.useRef<HTMLButtonElement>(null);
  const utils = useUtils();
  const mergedRef = useForkRef(forwardedRef, ref);

  const isSelected = React.useMemo(
    () => baseRootContext.selectedDates.some((date) => utils.isSameDay(date, value)),
    [baseRootContext.selectedDates, value, utils],
  );

  const isCurrent = React.useMemo(() => utils.isSameDay(value, utils.date()), [utils, value]);

  const isOutsideCurrentMonth = React.useMemo(
    () =>
      baseDaysGridBodyContext.currentMonth == null
        ? false
        : !utils.isSameMonth(baseDaysGridBodyContext.currentMonth, value),
    [baseDaysGridBodyContext.currentMonth, value, utils],
  );

  const isDateInvalid = baseRootContext.isDateInvalid;
  const isInvalid = React.useMemo(() => isDateInvalid(value), [value, isDateInvalid]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [baseRootContext.disabled, isInvalid]);

  const isTabbable = React.useMemo(
    () =>
      !isOutsideCurrentMonth &&
      baseDaysGridBodyContext.tabbableDays.some((day) => utils.isSameDay(day, value)),
    [utils, isOutsideCurrentMonth, baseDaysGridBodyContext.tabbableDays, value],
  );

  const ctx = React.useMemo<useBaseCalendarDaysCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isCurrent,
      isOutsideCurrentMonth,
      selectDay: baseDaysGridBodyContext.selectDay,
    }),
    [
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isCurrent,
      isOutsideCurrentMonth,
      baseDaysGridBodyContext.selectDay,
    ],
  );

  const registerDaysGridCell = baseRootContext.registerDaysGridCell;
  useEnhancedEffect(() => {
    return registerDaysGridCell({
      cell: ref,
      row: baseDaysGridRowContext.ref,
      grid: baseDaysGridBodyContext.ref,
    });
  }, [baseDaysGridBodyContext.ref, baseDaysGridRowContext.ref, registerDaysGridCell]);

  return {
    ref: mergedRef,
    ctx,
  };
}

export namespace useBaseCalendarDaysCellWrapper {
  export interface Parameters extends Pick<useBaseCalendarDaysCell.Parameters, 'value'> {
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
    ctx: useBaseCalendarDaysCell.Context;
  }
}
