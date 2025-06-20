import * as React from 'react';
import { PickerOnChangeFn } from './useViews';
import { getMeridiem, convertToMeridiem } from '../utils/time-utils';
import { PickerSelectionState } from './usePicker';
import { PickersTimezone, PickerValidDate } from '../../models';
import { usePickerAdapter } from '../../hooks/usePickerAdapter';

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
  const adapter = usePickerAdapter();
  return React.useMemo(() => {
    const now = adapter.date(undefined, timezone);
    const lastEnabledMonth = adapter.startOfMonth(
      disableFuture && adapter.isBefore(now, maxDate) ? now : maxDate,
    );
    return !adapter.isAfter(lastEnabledMonth, month);
  }, [disableFuture, maxDate, month, adapter, timezone]);
}

export function usePreviousMonthDisabled(
  month: PickerValidDate,
  {
    disablePast,
    minDate,
    timezone,
  }: Pick<MonthValidationOptions, 'disablePast' | 'minDate' | 'timezone'>,
) {
  const adapter = usePickerAdapter();

  return React.useMemo(() => {
    const now = adapter.date(undefined, timezone);
    const firstEnabledMonth = adapter.startOfMonth(
      disablePast && adapter.isAfter(now, minDate) ? now : minDate,
    );
    return !adapter.isBefore(firstEnabledMonth, month);
  }, [disablePast, minDate, month, adapter, timezone]);
}

export function useMeridiemMode(
  date: PickerValidDate | null,
  ampm: boolean | undefined,
  onChange: PickerOnChangeFn,
  selectionState?: PickerSelectionState,
) {
  const adapter = usePickerAdapter();
  const cleanDate = React.useMemo(() => (!adapter.isValid(date) ? null : date), [adapter, date]);

  const meridiemMode = getMeridiem(cleanDate, adapter);

  const handleMeridiemChange = React.useCallback(
    (mode: 'am' | 'pm') => {
      const timeWithMeridiem =
        cleanDate == null ? null : convertToMeridiem(cleanDate, mode, Boolean(ampm), adapter);
      onChange(timeWithMeridiem, selectionState ?? 'partial');
    },
    [ampm, cleanDate, onChange, selectionState, adapter],
  );

  return { meridiemMode, handleMeridiemChange };
}
