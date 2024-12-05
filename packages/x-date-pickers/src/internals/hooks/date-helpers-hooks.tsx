import * as React from 'react';
import { useUtils } from './useUtils';
import { PickerOnChangeFn } from './useViews';
import { getMeridiem, convertToMeridiem } from '../utils/time-utils';
import { PickerSelectionState } from './usePicker';
import { PickersTimezone, PickerValidDate } from '../../models';

export interface MonthValidationOptions {
  disablePast?: boolean;
  disableFuture?: boolean;
  minDate: PickerValidDate;
  maxDate: PickerValidDate;
  timezone: PickersTimezone;
}

export function useNextMonthDisabled(
  month: PickerValidDate,
  {
    disableFuture,
    maxDate,
    timezone,
  }: Pick<MonthValidationOptions, 'disableFuture' | 'maxDate' | 'timezone'>,
) {
  const utils = useUtils();
  return React.useMemo(() => {
    const now = utils.date(undefined, timezone);
    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, maxDate) ? now : maxDate,
    );
    return !utils.isAfter(lastEnabledMonth, month);
  }, [disableFuture, maxDate, month, utils, timezone]);
}

export function usePreviousMonthDisabled(
  month: PickerValidDate,
  {
    disablePast,
    minDate,
    timezone,
  }: Pick<MonthValidationOptions, 'disablePast' | 'minDate' | 'timezone'>,
) {
  const utils = useUtils();

  return React.useMemo(() => {
    const now = utils.date(undefined, timezone);
    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, minDate) ? now : minDate,
    );
    return !utils.isBefore(firstEnabledMonth, month);
  }, [disablePast, minDate, month, utils, timezone]);
}

export function useMeridiemMode(
  date: PickerValidDate | null,
  ampm: boolean | undefined,
  onChange: PickerOnChangeFn,
  selectionState?: PickerSelectionState,
) {
  const utils = useUtils();
  const meridiemMode = getMeridiem(date, utils);

  const handleMeridiemChange = React.useCallback(
    (mode: 'am' | 'pm') => {
      const timeWithMeridiem =
        date == null ? null : convertToMeridiem(date, mode, Boolean(ampm), utils);
      onChange(timeWithMeridiem, selectionState ?? 'partial');
    },
    [ampm, date, onChange, selectionState, utils],
  );

  return { meridiemMode, handleMeridiemChange };
}
