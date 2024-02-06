import * as React from 'react';
import { useUtils } from './useUtils';
import { PickerOnChangeFn } from './useViews';
import { getMeridiem, convertToMeridiem } from '../utils/time-utils';
import { PickerSelectionState } from './usePicker';
import { PickersTimezone, PickerValidDate } from '../../models';

export interface MonthValidationOptions<TDate extends PickerValidDate> {
  disablePast?: boolean;
  disableFuture?: boolean;
  minDate: TDate;
  maxDate: TDate;
  timezone: PickersTimezone;
}

export function useNextMonthDisabled<TDate extends PickerValidDate>(
  month: TDate,
  {
    disableFuture,
    maxDate,
    timezone,
  }: Pick<MonthValidationOptions<TDate>, 'disableFuture' | 'maxDate' | 'timezone'>,
) {
  const utils = useUtils<TDate>();
  return React.useMemo(() => {
    const now = utils.date(undefined, timezone);
    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, maxDate) ? now : maxDate,
    );
    return !utils.isAfter(lastEnabledMonth, month);
  }, [disableFuture, maxDate, month, utils, timezone]);
}

export function usePreviousMonthDisabled<TDate extends PickerValidDate>(
  month: TDate,
  {
    disablePast,
    minDate,
    timezone,
  }: Pick<MonthValidationOptions<TDate>, 'disablePast' | 'minDate' | 'timezone'>,
) {
  const utils = useUtils<TDate>();

  return React.useMemo(() => {
    const now = utils.date(undefined, timezone);
    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, minDate) ? now : minDate,
    );
    return !utils.isBefore(firstEnabledMonth, month);
  }, [disablePast, minDate, month, utils, timezone]);
}

export function useMeridiemMode<TDate extends PickerValidDate>(
  date: TDate | null,
  ampm: boolean | undefined,
  onChange: PickerOnChangeFn<TDate>,
  selectionState?: PickerSelectionState,
) {
  const utils = useUtils<TDate>();
  const meridiemMode = getMeridiem(date, utils);

  const handleMeridiemChange = React.useCallback(
    (mode: 'am' | 'pm') => {
      const timeWithMeridiem =
        date == null ? null : convertToMeridiem<TDate>(date, mode, Boolean(ampm), utils);
      onChange(timeWithMeridiem, selectionState ?? 'partial');
    },
    [ampm, date, onChange, selectionState, utils],
  );

  return { meridiemMode, handleMeridiemChange };
}
