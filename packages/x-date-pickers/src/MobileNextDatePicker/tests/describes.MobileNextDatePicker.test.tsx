import { screen, userEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  openPicker,
} from 'test/utils/pickers-utils';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';

describe('<MobileNextDatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MobileNextDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'new-picker',
  }));

  describeValue(MobileNextDatePicker, () => ({
    render,
    componentFamily: 'new-picker',
    type: 'date',
    variant: 'mobile',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const expectedValueStr =
        expectedValue == null ? 'MM/DD/YYYY' : adapterToUse.format(expectedValue, 'keyboardDate');
      expectInputValue(screen.getByRole('textbox'), expectedValueStr, true);
    },
    setNewValue: (value, { isOpened, applySameValue } = {}) => {
      if (!isOpened) {
        openPicker({ type: 'date', variant: 'mobile' });
      }

      const newValue = applySameValue ? value : adapterToUse.addDays(value, 1);
      userEvent.mousePress(screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue) }));

      return newValue;
    },
  }));
});
