import { screen, userEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  buildFieldInteractions,
} from 'test/utils/pickers-utils';
import { Unstable_DesktopNextDatePicker as DesktopNextDatePicker } from '@mui/x-date-pickers/DesktopNextDatePicker';

describe('<DesktopNextDatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({ clock });

  describeValidation(DesktopNextDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'picker',
  }));

  describeValue(DesktopNextDatePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date',
    variant: 'desktop',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const expectedValueStr =
        expectedValue == null ? 'MM/DD/YYYY' : adapterToUse.format(expectedValue, 'keyboardDate');
      expectInputValue(screen.getByRole('textbox'), expectedValueStr, true);
    },
    setNewValue: (value, { isOpened, applySameValue } = {}) => {
      const newValue = applySameValue ? value : adapterToUse.addDays(value, 1);

      if (isOpened) {
        userEvent.mousePress(
          screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue) }),
        );
      } else {
        const input = screen.getByRole('textbox');
        clickOnInput(input, 10); // Update the day
        userEvent.keyPress(input, { key: 'ArrowUp' });
      }

      return newValue;
    },
  }));
});
