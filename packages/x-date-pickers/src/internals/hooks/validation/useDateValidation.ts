import * as React from 'react';
import { useValidation, ValidationProps, Validator } from './useValidation';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from './models';
import { useLocalizationContext } from '../useUtils';
import { parseNonNullablePickerDate } from '../../utils/date-utils';

export interface ExportedDateValidationProps<TDate>
  extends DayValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export interface DateValidationProps<TInputDate, TDate>
  extends ValidationProps<DateValidationError, TInputDate | null>,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>> {}

export type DateValidationError =
  | 'invalidDate'
  | 'shouldDisableDate'
  | 'shouldDisableMonth'
  | 'shouldDisableYear'
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
  const minDate = parseNonNullablePickerDate(
    adapter.utils,
    props.minDate,
    adapter.defaultDates.minDate,
  );
  const maxDate = parseNonNullablePickerDate(
    adapter.utils,
    props.maxDate,
    adapter.defaultDates.maxDate,
  );

  if (date === null) {
    return null;
  }

  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';

    case Boolean(props.shouldDisableDate && props.shouldDisableDate(date)):
      return 'shouldDisableDate';

    case Boolean(props.shouldDisableMonth && props.shouldDisableMonth(date)):
      return 'shouldDisableMonth';

    case Boolean(props.shouldDisableYear && props.shouldDisableYear(date)):
      return 'shouldDisableYear';

    case Boolean(props.disableFuture && adapter.utils.isAfterDay(date, now)):
      return 'disableFuture';

    case Boolean(props.disablePast && adapter.utils.isBeforeDay(date, now)):
      return 'disablePast';

    case Boolean(minDate && adapter.utils.isBeforeDay(date, minDate)):
      return 'minDate';

    case Boolean(maxDate && adapter.utils.isAfterDay(date, maxDate)):
      return 'maxDate';

    default:
      return null;
  }
};

export const useIsDateDisabled = <TDate>({
  shouldDisableDate,
  shouldDisableMonth,
  shouldDisableYear,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
}: Omit<DateValidationProps<any, TDate>, keyof ValidationProps<any, any>>) => {
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
    ],
  );
};

export const isSameDateError = (a: DateValidationError, b: DateValidationError) => a === b;

export const useDateValidation = <TInputDate, TDate>(
  props: DateValidationProps<TInputDate, TDate>,
): DateValidationError => useValidation(props, validateDate, isSameDateError);
