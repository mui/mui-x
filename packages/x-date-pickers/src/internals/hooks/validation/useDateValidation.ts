import * as React from 'react';
import { useValidation, ValidationProps, Validator } from './useValidation';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from './models';
import { useLocalizationContext } from '../useUtils';
import { applyDefaultDate } from '../../utils/date-utils';

export interface ExportedDateValidationProps<TDate>
  extends DayValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export interface DateValidationProps<TDate>
  extends ValidationProps<DateValidationError, TDate | null>,
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

export const validateDate: Validator<any, DateValidationProps<any>> = ({
  props,
  value,
  adapter,
}): DateValidationError => {
  const now = adapter.utils.date()!;
  const minDate = applyDefaultDate(adapter.utils, props.minDate, adapter.defaultDates.minDate);
  const maxDate = applyDefaultDate(adapter.utils, props.maxDate, adapter.defaultDates.maxDate);

  if (value === null) {
    return null;
  }

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
}: Omit<DateValidationProps<TDate>, keyof ValidationProps<any, any>>) => {
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

export const useDateValidation = <TDate>(props: DateValidationProps<TDate>): DateValidationError =>
  useValidation(props, validateDate, isSameDateError);
