import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { useUtils } from '../../../../hooks/useUtils';
import { useBaseCalendarRootContext } from '../root/BaseCalendarRootContext';
import type { useBaseCalendarDayCell } from './useBaseCalendarDayCell';
import { useCalendarDayGridRowContext } from '../../../Calendar/day-grid-row/CalendarDayGridRowContext';
import { useCalendarDayGridBodyContext } from '../day-grid-body/CalendarDayGridBodyContext';
import { PickerValidDate } from '../../../../../models';
import { mergeDateAndTime } from '../../../../utils/date-utils';

export function useBaseCalendarDayCellWrapper(
  parameters: useBaseCalendarDayCellWrapper.Parameters,
): useBaseCalendarDayCellWrapper.ReturnValue {
  const { forwardedRef, value } = parameters;
  const baseRootContext = useBaseCalendarRootContext();
  const baseDayGridBodyContext = useCalendarDayGridBodyContext();
  const baseDayGridRowContext = useCalendarDayGridRowContext();
  const ref = React.useRef<HTMLButtonElement>(null);
  const utils = useUtils();
  const mergedRef = useForkRef(forwardedRef, ref);

  const isSelected = React.useMemo(
    () => baseRootContext.selectedDates.some((date) => utils.isSameDay(date, value)),
    [baseRootContext.selectedDates, value, utils],
  );

  const isCurrent = React.useMemo(() => utils.isSameDay(value, utils.date()), [utils, value]);

  const isStartOfWeek = React.useMemo(
    () => utils.isSameDay(value, utils.startOfWeek(value)),
    [utils, value],
  );

  const isEndOfWeek = React.useMemo(
    () => utils.isSameDay(value, utils.endOfWeek(value)),
    [utils, value],
  );

  const isOutsideCurrentMonth = React.useMemo(
    () =>
      baseDayGridBodyContext.month == null
        ? false
        : !utils.isSameMonth(baseDayGridBodyContext.month, value),
    [baseDayGridBodyContext.month, value, utils],
  );

  const isDateInvalid = baseRootContext.isDateInvalid;
  const isInvalid = React.useMemo(() => isDateInvalid(value), [value, isDateInvalid]);

  const isDisabled = React.useMemo(() => {
    if (baseRootContext.disabled) {
      return true;
    }

    return isInvalid;
  }, [baseRootContext.disabled, isInvalid]);

  const canCellBeTabbed = baseDayGridBodyContext.canCellBeTabbed;
  const isTabbable = React.useMemo(() => canCellBeTabbed(value), [canCellBeTabbed, value]);

  const selectDay = useEventCallback((date: PickerValidDate) => {
    if (baseRootContext.readOnly) {
      return;
    }

    const newCleanValue = mergeDateAndTime(utils, date, baseRootContext.currentDate);

    baseRootContext.selectDate(newCleanValue, { section: 'day' });
  });

  const ctx = React.useMemo<useBaseCalendarDayCell.Context>(
    () => ({
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isCurrent,
      isStartOfWeek,
      isEndOfWeek,
      isOutsideCurrentMonth,
      selectDay,
    }),
    [
      isSelected,
      isDisabled,
      isInvalid,
      isTabbable,
      isStartOfWeek,
      isEndOfWeek,
      isCurrent,
      isOutsideCurrentMonth,
      selectDay,
    ],
  );

  const registerDayGridCell = baseRootContext.registerDayGridCell;
  useEnhancedEffect(() => {
    return registerDayGridCell({
      cell: ref,
      row: baseDayGridRowContext.ref,
      grid: baseDayGridBodyContext.ref,
    });
  }, [baseDayGridBodyContext.ref, baseDayGridRowContext.ref, registerDayGridCell]);

  return {
    ref: mergedRef,
    ctx,
  };
}

export namespace useBaseCalendarDayCellWrapper {
  export interface Parameters extends Pick<useBaseCalendarDayCell.Parameters, 'value'> {
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
    ctx: useBaseCalendarDayCell.Context;
  }
}
