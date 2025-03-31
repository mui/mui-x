import { fireEvent, screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<DesktopDatePicker /> - Describe Value', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValue<PickerValue, 'picker'>(DesktopDatePicker, () => ({
    render,
    clock,
    componentFamily: 'picker',
    type: 'date',
    variant: 'desktop',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const fieldRoot = getFieldInputRoot();

      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, 'keyboardDate')
        : 'MM/DD/YYYY';

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue, selectSection, pressKey }) => {
      const newValue = applySameValue ? value! : adapterToUse.addDays(value!, 1);

      if (isOpened) {
        fireEvent.click(
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
