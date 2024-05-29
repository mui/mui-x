import { screen, userEvent } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  describeValidation,
  describeValue,
  describePicker,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

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
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const fieldRoot = getFieldInputRoot();

      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, 'keyboardDate')
        : 'MM/DD/YYYY';

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue, selectSection, pressKey }) => {
      const newValue = applySameValue ? value : adapterToUse.addDays(value, 1);

      if (isOpened) {
        userEvent.mousePress(
          screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
        );
      } else {
        selectSection('day');
        pressKey(undefined, 'ArrowUp');
      }

      return newValue;
    },
  }));
});
