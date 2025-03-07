import { MuiPickersAdapter, PickerValidDate } from '../../../../../models';

export function getFirstEnabledMonth(
  utils: MuiPickersAdapter,
  validationProps: { minDate: PickerValidDate },
): PickerValidDate {
  return utils.startOfMonth(validationProps.minDate);
}

export function getLastEnabledMonth(
  utils: MuiPickersAdapter,
  validationProps: { maxDate: PickerValidDate },
): PickerValidDate {
  return utils.startOfMonth(validationProps.maxDate);
}

export function getFirstEnabledYear(
  utils: MuiPickersAdapter,
  validationProps: { minDate: PickerValidDate },
): PickerValidDate {
  return utils.startOfYear(validationProps.minDate);
}

export function getLastEnabledYear(
  utils: MuiPickersAdapter,
  validationProps: { maxDate: PickerValidDate },
): PickerValidDate {
  return utils.startOfYear(validationProps.maxDate);
}
