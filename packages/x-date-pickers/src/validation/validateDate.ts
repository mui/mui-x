import { Validator } from './useValidation';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import { DateValidationError, PickerValidDate } from '../models';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { singleItemValueManager } from '../internals/utils/valueManagers';

/**
 * Validation props used by the Date Picker, Date Field and Date Calendar components.
 */
export interface ExportedValidateDateProps
  extends DayValidationProps,
    MonthValidationProps,
    YearValidationProps,
    BaseDateValidationProps {}

export interface ValidateDateProps
  extends DayValidationProps,
    MonthValidationProps,
    YearValidationProps,
    Required<BaseDateValidationProps> {}

export const validateDate: Validator<
  PickerValidDate | null,
  DateValidationError,
  ValidateDateProps
> = ({ props, value, timezone, adapter }): DateValidationError => {
  if (value === null) {
    return null;
  }

  const { shouldDisableDate, shouldDisableMonth, shouldDisableYear, disablePast, disableFuture } =
    props;

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

validateDate.valueManager = singleItemValueManager;
