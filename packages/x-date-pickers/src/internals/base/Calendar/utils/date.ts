import { ValidateDateProps } from '../../../../validation';
import { MuiPickersAdapter, PickerValidDate } from '../../../../models';

export const getFirstEnabledMonth = (
  utils: MuiPickersAdapter,
  validationProps: ValidateDateProps,
): PickerValidDate => {
  const now = utils.date();
  return utils.startOfMonth(
    validationProps.disablePast && utils.isAfter(now, validationProps.minDate)
      ? now
      : validationProps.minDate,
  );
};

export const getLastEnabledMonth = (
  utils: MuiPickersAdapter,
  validationProps: ValidateDateProps,
): PickerValidDate => {
  const now = utils.date();
  return utils.startOfMonth(
    validationProps.disableFuture && utils.isBefore(now, validationProps.maxDate)
      ? now
      : validationProps.maxDate,
  );
};
