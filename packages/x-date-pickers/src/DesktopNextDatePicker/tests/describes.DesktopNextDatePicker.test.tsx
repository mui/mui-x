import { screen, userEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  buildFieldInteractions,
} from 'test/utils/pickers-utils';
import { Unstable_DesktopNextDatePicker as DesktopNextDatePicker } from '@mui/x-date-pickers';

describe('<NextDatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({ clock });

  describeValidation(DesktopNextDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'new-picker',
  }));

  describeValue(DesktopNextDatePicker, () => ({
    render,
    componentFamily: 'new-picker',
    type: 'date',
    variant: 'desktop',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const expectedValueStr =
        expectedValue == null ? 'MM/DD/YYYY' : adapterToUse.format(expectedValue, 'keyboardDate');
      expectInputValue(screen.getByRole('textbox'), expectedValueStr, true);
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addDays(value, 1);
      const input = screen.getByRole('textbox');
      clickOnInput(input, 5); // Update the day
      userEvent.keyPress(input, { key: 'ArrowUp' });
      return newValue;
    },
  }));
});
