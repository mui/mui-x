import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useUtils } from '../../../../hooks/useUtils';
import { useCompositeListItem } from '../../../composite/list/useCompositeListItem';
import { useBaseCalendarDaysGridContext } from '../days-grid/BaseCalendarDaysGridContext';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import type { useBaseCalendarDaysCell } from './useBaseCalendarDaysCell';

export function useBaseCalendarDaysCellWrapper(
  parameters: useBaseCalendarDaysCellWrapper.Parameters,
): useBaseCalendarDaysCellWrapper.ReturnValue {
  const { forwardedRef, value } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseDaysGridContext = useBaseCalendarDaysGridContext();
  const { ref: listItemRef, index: colIndex } = useCompositeListItem();
  const utils = useUtils();
  const mergedRef = useForkRef(forwardedRef, listItemRef);

  const isSelected = React.useMemo(
    () => baseRootContext.selectedDates.some((date) => utils.isSameDay(date, value)),
    [baseRootContext.selectedDates, value, utils],
  );

  const isCurrent = React.useMemo(() => utils.isSameDay(value, utils.date()), [utils, value]);

  const isOutsideCurrentMonth = React.useMemo(
    () =>
      baseDaysGridContext.currentMonth == null
        ? false
        : !utils.isSameMonth(baseDaysGridContext.currentMonth, value),
    [baseDaysGridContext.currentMonth, value, utils],
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
    () => baseDaysGridContext.tabbableDays.some((day) => utils.isSameDay(day, value)),
    [utils, baseDaysGridContext.tabbableDays, value],
  );

  const ctx = React.useMemo<useBaseCalendarDaysCell.Context>(
    () => ({
      colIndex,
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isCurrent,
      isOutsideCurrentMonth,
      selectDay: baseDaysGridContext.selectDay,
    }),
    [
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isCurrent,
      isOutsideCurrentMonth,
      baseDaysGridContext.selectDay,
      colIndex,
    ],
  );

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
