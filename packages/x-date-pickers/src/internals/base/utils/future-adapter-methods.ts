import { MuiPickersAdapter, PickerValidDate } from '../../../models';

export function startOfHour(utils: MuiPickersAdapter, value: PickerValidDate) {
  return utils.setSeconds(utils.setMinutes(value, 0), 0);
}

export function endOfHour(utils: MuiPickersAdapter, value: PickerValidDate) {
  return utils.setSeconds(utils.setMinutes(value, 59), 59);
}

export function startOfMinute(utils: MuiPickersAdapter, value: PickerValidDate) {
  return utils.setSeconds(value, 0);
}

export function endOfMinute(utils: MuiPickersAdapter, value: PickerValidDate) {
  return utils.setSeconds(value, 59);
}
