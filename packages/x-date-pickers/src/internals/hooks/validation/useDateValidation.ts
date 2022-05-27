import * as React from 'react';
import { useValidation, ValidationProps, Validator } from './useValidation';
import { DayValidationProps } from './models';
import { useLocalizationContext } from '../useUtils';

export interface ExportedDateValidationProps<TDate> extends DayValidationProps<TDate> {}

export interface DateValidationProps<TInputDate, TDate>
  extends ValidationProps<DateValidationError, TInputDate | null>,
    ExportedDateValidationProps<TDate> {}

export type DateValidationError =
  | 'invalidDate'
  | 'shouldDisableDate'
  | 'disableFuture'
  | 'disablePast'
  | 'minDate'
  | 'maxDate'
  | null;

export const validateDate: Validator<any, DateValidationProps<any, any>> = ({
  props,
  value,
  adapter,
}): DateValidationError => {
  const now = adapter.utils.date()!;
  const date = adapter.utils.date(value);

  const {
    shouldDisableDate,
    minDate = adapter.defaultDates.minDate,
    maxDate = adapter.defaultDates.maxDate,
    disableFuture,
    disablePast,
  } = props;

  if (date === null) {
    return null;
  }

  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';

    case Boolean(shouldDisableDate && shouldDisableDate(date)):
      return 'shouldDisableDate';

    case Boolean(disableFuture && adapter.utils.isAfterDay(date, now)):
      return 'disableFuture';

    case Boolean(disablePast && adapter.utils.isBeforeDay(date, now)):
      return 'disablePast';

    case Boolean(minDate && adapter.utils.isBeforeDay(date, minDate)):
      return 'minDate';

    case Boolean(maxDate && adapter.utils.isAfterDay(date, maxDate)):
      return 'maxDate';

    default:
      return null;
  }
};

export const useIsDayDisabled = <TDate>({
  shouldDisableDate,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
}: DayValidationProps<TDate>) => {
  const adapter = useLocalizationContext<TDate>();

  return React.useCallback(
    (day: TDate | null) =>
      validateDate({
        adapter,
        value: day,
        props: {
          shouldDisableDate,
          minDate,
          maxDate,
          disableFuture,
          disablePast,
        },
      }) !== null,
    [adapter, shouldDisableDate, minDate, maxDate, disableFuture, disablePast],
  );
};

const isSameDateError = (a: DateValidationError, b: DateValidationError) => a === b;

export const useDateValidation = <TInputDate, TDate>(
  props: DateValidationProps<TInputDate, TDate>,
): DateValidationError => useValidation(props, validateDate, isSameDateError);
