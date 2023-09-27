import { screen, userEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  expectInputPlaceholder,
  getTextbox,
} from 'test/utils/pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { describePicker } from '@mui/x-date-pickers/tests/describePicker';

describe('<DesktopDatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describePicker(DesktopDatePicker, { render, fieldType: 'single-input', variant: 'desktop' });

  describeValidation(DesktopDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'picker',
    variant: 'desktop',
  }));

  describeValue(DesktopDatePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date',
    variant: 'desktop',
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
    setNewValue: (value, { isOpened, applySameValue, selectSection }) => {
      const newValue = applySameValue ? value : adapterToUse.addDays(value, 1);

      if (isOpened) {
        userEvent.mousePress(
          screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
        );
      } else {
        selectSection('day');
        const input = getTextbox();
        userEvent.keyPress(input, { key: 'ArrowUp' });
      }

      return newValue;
    },
  }));
});
