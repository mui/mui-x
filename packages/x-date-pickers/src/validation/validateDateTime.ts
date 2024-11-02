import { Validator } from './useValidation';
import { ExportedValidateDateProps, validateDate, ValidateDateProps } from './validateDate';
import { ExportedValidateTimeProps, validateTime, ValidateTimeProps } from './validateTime';
import { DateTimeValidationError, PickerValidDate } from '../models';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { DateTimeValidationProps } from '../internals/models/validation';

/**
 * Validation props used by the Date Time Picker and Date Time Field components.
 */
export interface ExportedValidateDateTimeProps<TDate extends PickerValidDate>
  extends ExportedValidateDateProps<TDate>,
    ExportedValidateTimeProps<TDate>,
    DateTimeValidationProps<TDate> {}

export interface ValidateDateTimeProps<TDate extends PickerValidDate>
  extends ValidateDateProps<TDate>,
    ValidateTimeProps<TDate> {}

export const validateDateTime: Validator<
  any | null,
  any,
  DateTimeValidationError,
  ValidateDateTimeProps<any>
> = ({ adapter, value, timezone, props }) => {
  const dateValidationResult = validateDate({
    adapter,
    value,
    timezone,
    props,
  });

  if (dateValidationResult !== null) {
    return dateValidationResult;
  }

  return validateTime({
    adapter,
    value,
    timezone,
    props,
  });
};

validateDateTime.valueManager = singleItemValueManager;
