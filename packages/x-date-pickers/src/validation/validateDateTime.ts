import { Validator } from './useValidation';
import { ExportedValidateDateProps, validateDate, ValidateDateProps } from './validateDate';
import { ExportedValidateTimeProps, validateTime, ValidateTimeProps } from './validateTime';
import { DateTimeValidationError, PickerValidDate } from '../models';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { DateTimeValidationProps } from '../internals/models/validation';

/**
 * Validation props used by the Date Time Picker and Date Time Field components.
 */
export interface ExportedValidateDateTimeProps
  extends ExportedValidateDateProps,
    ExportedValidateTimeProps,
    DateTimeValidationProps {}

export interface ValidateDateTimeProps extends ValidateDateProps, ValidateTimeProps {}

export const validateDateTime: Validator<
  PickerValidDate | null,
  DateTimeValidationError,
  ValidateDateTimeProps
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
