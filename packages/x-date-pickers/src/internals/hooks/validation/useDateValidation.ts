import * as React from 'react';
import { useValidation, ValidationProps, Validator } from './useValidation';
import { DayValidationProps } from './models';
import { useDefaultDates, useUtils } from '../useUtils';

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

export const validateDate: Validator<any, DateValidationProps<any, any>> = (
  utils,
  value,
  { disablePast, disableFuture, minDate, maxDate, shouldDisableDate },
): DateValidationError => {
  const now = utils.date()!;
  const date = utils.date(value);

  if (date === null) {
    return null;
  }

  switch (true) {
    case !utils.isValid(value):
      return 'invalidDate';

    case Boolean(shouldDisableDate && shouldDisableDate(date)):
      return 'shouldDisableDate';

    case Boolean(disableFuture && utils.isAfterDay(date, now)):
      return 'disableFuture';

    case Boolean(disablePast && utils.isBeforeDay(date, now)):
      return 'disablePast';

    case Boolean(minDate && utils.isBeforeDay(date, minDate)):
      return 'minDate';

    case Boolean(maxDate && utils.isAfterDay(date, maxDate)):
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
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  return React.useCallback(
    (day: TDate | null) =>
      validateDate(utils, day, {
        shouldDisableDate,
        minDate: minDate ?? defaultDates.minDate,
        maxDate: maxDate ?? defaultDates.maxDate,
        disableFuture,
        disablePast,
      }) !== null,
    [
      utils,
      shouldDisableDate,
      minDate,
      defaultDates.minDate,
      defaultDates.maxDate,
      maxDate,
      disableFuture,
      disablePast,
    ],
  );
};

const isSameDateError = (a: DateValidationError, b: DateValidationError) => a === b;

export const useDateValidation = <TInputDate, TDate>(
  props: DateValidationProps<TInputDate, TDate>,
): DateValidationError => useValidation(props, validateDate, isSameDateError);
