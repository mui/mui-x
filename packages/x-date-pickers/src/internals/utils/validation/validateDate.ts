import { Validator } from '../../hooks/useValidation';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../../models/validation';
import { DateValidationError, PickerValidDate, TimezoneProps } from '../../../models';
import { applyDefaultDate } from '../date-utils';
import { DefaultizedProps } from '../../models/helpers';

export interface DateComponentValidationProps<TDate extends PickerValidDate>
  extends DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    Required<BaseDateValidationProps<TDate>>,
    DefaultizedProps<TimezoneProps, 'timezone'> {}

export const validateDate: Validator<
  any | null,
  any,
  DateValidationError,
  DateComponentValidationProps<any>
> = ({ props, value, adapter }): DateValidationError => {
  if (value === null) {
    return null;
  }

  const {
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    disablePast,
    disableFuture,
    timezone,
  } = props;

  const now = adapter.utils.date(undefined, timezone);
  const minDate = applyDefaultDate(adapter.utils, props.minDate, adapter.defaultDates.minDate);
  const maxDate = applyDefaultDate(adapter.utils, props.maxDate, adapter.defaultDates.maxDate);

  switch (true) {
    case !adapter.utils.isValid(value):
      return 'invalidDate';

    case Boolean(shouldDisableDate && shouldDisableDate(value)):
      return 'shouldDisableDate';

    case Boolean(shouldDisableMonth && shouldDisableMonth(value)):
      return 'shouldDisableMonth';

    case Boolean(shouldDisableYear && shouldDisableYear(value)):
      return 'shouldDisableYear';

    case Boolean(disableFuture && adapter.utils.isAfterDay(value, now)):
      return 'disableFuture';

    case Boolean(disablePast && adapter.utils.isBeforeDay(value, now)):
      return 'disablePast';

    case Boolean(minDate && adapter.utils.isBeforeDay(value, minDate)):
      return 'minDate';

    case Boolean(maxDate && adapter.utils.isAfterDay(value, maxDate)):
      return 'maxDate';

    default:
      return null;
  }
};
