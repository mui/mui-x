import * as React from 'react';
import {
  DateComponentValidationProps,
  validateDate,
} from '../internals/utils/validation/validateDate';
import { useLocalizationContext } from '../internals/hooks/useUtils';

export const useIsDateDisabled = <TDate>({
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  timezone,
}: DateComponentValidationProps<TDate>) => {
  const adapter = useLocalizationContext<TDate>();

  return React.useCallback(
    (day: TDate | null) =>
      validateDate({
        adapter,
        value: day,
        props: {
          shouldDisableDate,
          shouldDisableMonth,
          shouldDisableYear,
          minDate,
          maxDate,
          disableFuture,
          disablePast,
          timezone,
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
