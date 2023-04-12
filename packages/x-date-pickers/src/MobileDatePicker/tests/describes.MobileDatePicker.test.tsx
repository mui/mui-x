import { screen, userEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  openPicker,
  expectInputPlaceholder,
  getTextbox,
} from 'test/utils/pickers-utils';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

describe('<MobileDatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MobileDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'picker',
  }));

  describeValue(MobileDatePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date',
    variant: 'mobile',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const input = getTextbox();
      if (!expectedValue) {
        expectInputPlaceholder(input, 'MM/DD/YYYY');
      }
      expectInputValue(
        input,
        expectedValue ? adapterToUse.format(expectedValue, 'keyboardDate') : '',
      );
    },
    setNewValue: (value, { isOpened, applySameValue } = {}) => {
      if (!isOpened) {
        openPicker({ type: 'date', variant: 'mobile' });
      }

      const newValue = applySameValue ? value : adapterToUse.addDays(value, 1);
      userEvent.mousePress(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );

      // Close the picker to return to the initial state
      if (!isOpened) {
        userEvent.keyPress(document.activeElement!, { key: 'Escape' });
        clock.runToLast();
      }

      return newValue;
    },
  }));
});
