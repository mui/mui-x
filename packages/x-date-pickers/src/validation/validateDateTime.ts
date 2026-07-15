import type { Validator } from './useValidation';
import type {
  ExportedValidateDateProps,
  ValidateDateProps,
  ValidateDatePropsToDefault,
} from './validateDate';
import { validateDate } from './validateDate';
import type {
  ExportedValidateTimeProps,
  ValidateTimeProps,
  ValidateTimePropsToDefault,
} from './validateTime';
import { validateTime } from './validateTime';
import type { DateTimeValidationError } from '../models';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import type { DateTimeValidationProps } from '../internals/models/validation';
import type { PickerValue } from '../internals/models';

/**
 * Validation props used by the Date Time Picker and Date Time Field components.
 */
export interface ExportedValidateDateTimeProps
  extends ExportedValidateDateProps, ExportedValidateTimeProps, DateTimeValidationProps {}

/**
 * Validation props as received by the validateDateTime method.
 */
export interface ValidateDateTimeProps extends ValidateDateProps, ValidateTimeProps {}

/**
 * Name of the props that should be defaulted before being passed to the validateDateTime method.
 */
export type ValidateDateTimePropsToDefault =
  ValidateDatePropsToDefault | ValidateTimePropsToDefault;

export const validateDateTime: Validator<
  PickerValue,
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
