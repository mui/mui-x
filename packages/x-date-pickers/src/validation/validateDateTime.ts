import { Validator } from './useValidation';
import { validateDate, ValidateDateProps } from './validateDate';
import { validateTime, ValidateTimeProps } from './validateTime';
import { DateTimeValidationError, PickerValidDate } from '../models';
import { singleItemValueManager } from '../internals/utils/valueManagers';

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
