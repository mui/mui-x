import { ValidateDateProps } from '../../../../validation';
import { MuiPickersAdapter, PickerValidDate } from '../../../../models';
import { BaseDateValidationProps } from '../../../models/validation';

export function getFirstEnabledMonth(
  utils: MuiPickersAdapter,
  validationProps: Required<BaseDateValidationProps>,
): PickerValidDate {
  const now = utils.date();
  return utils.startOfMonth(
    validationProps.disablePast && utils.isAfter(now, validationProps.minDate)
      ? now
      : validationProps.minDate,
  );
}

export function getLastEnabledMonth(
  utils: MuiPickersAdapter,
  validationProps: Required<BaseDateValidationProps>,
): PickerValidDate {
  const now = utils.date();
  return utils.startOfMonth(
    validationProps.disableFuture && utils.isBefore(now, validationProps.maxDate)
      ? now
      : validationProps.maxDate,
  );
}

export function getFirstEnabledYear(
  utils: MuiPickersAdapter,
  validationProps: Required<BaseDateValidationProps>,
): PickerValidDate {
  const now = utils.date();
  return utils.startOfYear(
    validationProps.disablePast && utils.isAfter(now, validationProps.minDate)
      ? now
      : validationProps.minDate,
  );
}

export function getLastEnabledYear(
  utils: MuiPickersAdapter,
  validationProps: Required<BaseDateValidationProps>,
): PickerValidDate {
  const now = utils.date();
  return utils.startOfYear(
    validationProps.disableFuture && utils.isBefore(now, validationProps.maxDate)
      ? now
      : validationProps.maxDate,
  );
}
