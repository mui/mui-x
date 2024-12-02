import type { MakeRequired } from '@mui/x-internals/types';
import { Validator } from './useValidation';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/models/validation';
import { DateValidationError } from '../models';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { PickerValue } from '../internals/models';

/**
 * Validation props used by the Date Picker, Date Field and Date Calendar components.
 */
export interface ExportedValidateDateProps
  extends DayValidationProps,
    MonthValidationProps,
    YearValidationProps,
    BaseDateValidationProps {}

/**
 * Validation props as received by the validateDate method.
 */
export interface ValidateDateProps
  extends MakeRequired<ExportedValidateDateProps, ValidateDatePropsToDefault> {}

/**
 * Name of the props that should be defaulted before being passed to the validateDate method.
 */
export type ValidateDatePropsToDefault = keyof BaseDateValidationProps;

export const validateDate: Validator<PickerValue, DateValidationError, ValidateDateProps> = ({
  props,
  value,
  timezone,
  adapter,
}): DateValidationError => {
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
