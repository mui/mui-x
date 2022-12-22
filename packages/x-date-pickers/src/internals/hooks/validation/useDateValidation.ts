import * as React from 'react';
import { useValidation, ValidationProps, Validator } from './useValidation';
import {
  BaseDateValidationProps,
  CommonDateTimeValidationError,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from './models';
import { useLocalizationContext } from '../useUtils';
import { applyDefaultDate } from '../../utils/date-utils';

export interface DateComponentValidationProps<TDate>
  extends DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>> {}

export type DateValidationError =
  | CommonDateTimeValidationError
  | 'shouldDisableDate'
  | 'shouldDisableMonth'
  | 'shouldDisableYear'
  | 'minDate'
  | 'maxDate';

export const validateDate: Validator<
  any | null,
  any,
  DateValidationError,
  DateComponentValidationProps<any>
> = ({ props, value, adapter }): DateValidationError => {
  if (value === null) {
    return null;
  }

  const now = adapter.utils.date()!;
  const minDate = applyDefaultDate(adapter.utils, props.minDate, adapter.defaultDates.minDate);
  const maxDate = applyDefaultDate(adapter.utils, props.maxDate, adapter.defaultDates.maxDate);

  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';

    case Boolean(props.shouldDisableDate && props.shouldDisableDate(value)):
      return 'shouldDisableDate';

    case Boolean(props.shouldDisableMonth && props.shouldDisableMonth(value)):
      return 'shouldDisableMonth';

    case Boolean(props.shouldDisableYear && props.shouldDisableYear(value)):
      return 'shouldDisableYear';

    case Boolean(props.disableFuture && adapter.utils.isAfterDay(value, now)):
      return 'disableFuture';

    case Boolean(props.disablePast && adapter.utils.isBeforeDay(value, now)):
      return 'disablePast';

    case Boolean(minDate && adapter.utils.isBeforeDay(value, minDate)):
      return 'minDate';

    case Boolean(maxDate && adapter.utils.isAfterDay(value, maxDate)):
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

// TODO v6: Drop with the legacy pickers
export const isSameDateError = (a: DateValidationError, b: DateValidationError) => a === b;

// TODO v6: Drop with the legacy pickers
export const useDateValidation = <TDate>(
  props: ValidationProps<DateValidationError, TDate | null, DateComponentValidationProps<TDate>>,
): DateValidationError => useValidation(props, validateDate, isSameDateError, null);
