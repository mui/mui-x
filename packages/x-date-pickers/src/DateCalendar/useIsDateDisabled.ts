'use client';
import * as React from 'react';
import { ValidateDateProps, validateDate } from '../validation';
import { useLocalizationContext } from '../internals/hooks/useUtils';
import { PickerValidDate, TimezoneProps } from '../models';
import { DefaultizedProps } from '../internals/models/helpers';

export const useIsDateDisabled = <TDate extends PickerValidDate>({
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  timezone,
}: ValidateDateProps<TDate> & DefaultizedProps<TimezoneProps, 'timezone'>) => {
  const adapter = useLocalizationContext<TDate>();

  return React.useCallback(
    (day: TDate | null) =>
      validateDate({
        adapter,
        value: day,
        timezone,
        props: {
          shouldDisableDate,
          shouldDisableMonth,
          shouldDisableYear,
          minDate,
          maxDate,
          disableFuture,
          disablePast,
        },
      }) !== null,
    [
      adapter,
      shouldDisableDate,
      shouldDisableMonth,
      shouldDisableYear,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      timezone,
    ],
  );
};
