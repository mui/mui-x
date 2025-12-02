'use client';
import * as React from 'react';
import { DefaultizedProps } from '@mui/x-internals/types';
import { ValidateDateProps, validateDate } from '../validation';
import { PickerValidDate, TimezoneProps } from '../models';
import { usePickerAdapter } from '../hooks/usePickerAdapter';

export const useIsDateDisabled = ({
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  timezone,
}: ValidateDateProps & DefaultizedProps<TimezoneProps, 'timezone'>) => {
  const adapter = usePickerAdapter();

  return React.useCallback(
    (day: PickerValidDate | null) =>
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
