import { MuiPickersAdapter } from '../../../../models/adapters';
import { PickerValidDate } from '../../../../models/pickers';

export function getOptionListDefaultItems(parameters: GetOptionListDefaultItemsParameters) {
  const { utils, start, end, getNextItem } = parameters;

  let current = start;
  const items: PickerValidDate[] = [];

  while (!utils.isAfter(current, end)) {
    items.push(current);
    current = getNextItem(current);
  }

  return items;
}

interface GetOptionListDefaultItemsParameters {
  utils: MuiPickersAdapter;
  start: PickerValidDate;
  end: PickerValidDate;
  getNextItem: (date: PickerValidDate) => PickerValidDate;
}
