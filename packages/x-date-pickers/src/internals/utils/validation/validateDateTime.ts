import { Validator } from '../../hooks/useValidation';
import { validateDate, DateComponentValidationProps } from './validateDate';
import { validateTime, TimeComponentValidationProps } from './validateTime';
import { DateTimeValidationError, PickerValidDate } from '../../../models';

export interface DateTimeComponentValidationProps<TDate extends PickerValidDate>
  extends DateComponentValidationProps<TDate>,
    TimeComponentValidationProps<TDate> {}

export const validateDateTime: Validator<
  any | null,
  any,
  DateTimeValidationError,
  DateTimeComponentValidationProps<any>
> = ({ props, value, adapter }) => {
  const dateValidationResult = validateDate({
    adapter,
    value,
    props,
  });

  if (dateValidationResult !== null) {
    return dateValidationResult;
  }

  return validateTime({
    adapter,
    value,
    props,
  });
};
