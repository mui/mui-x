import { fireEvent, screen } from '@mui/internal-test-utils';
import {
  adapterToUse,
  createPickerRenderer,
  expectFieldValueV7,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { PickerNonNullableRangeValue, PickerRangeValue } from '@mui/x-date-pickers/internals';

describe('<DesktopDateRangePicker /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  // With single input field
  describeValue<PickerRangeValue, 'picker'>(DesktopDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-range',
    variant: 'desktop',
    initialFocus: 'start',
    fieldType: 'single-input',
    values: [
      // initial start and end dates
      [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-04')],
      // start and end dates after `setNewValue`
      [adapterToUse.date('2018-01-02'), adapterToUse.date('2018-01-05')],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      const fieldRoot = getFieldInputRoot(0);

      const expectedStartValueStr = expectedValues[0]
        ? adapterToUse.format(expectedValues[0], 'keyboardDate')
        : 'MM/DD/YYYY';

      const expectedEndValueStr = expectedValues[1]
        ? adapterToUse.format(expectedValues[1], 'keyboardDate')
        : 'MM/DD/YYYY';

      const expectedValueStr = `${expectedStartValueStr} – ${expectedEndValueStr}`;

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (
      value,
      { isOpened, applySameValue, setEndDate = false, selectSection, pressKey },
    ) => {
      let newValue: PickerNonNullableRangeValue;
      if (applySameValue) {
        newValue = value;
      } else if (setEndDate) {
        newValue = [value[0], adapterToUse.addDays(value[1], 1)];
      } else {
        newValue = [adapterToUse.addDays(value[0], 1), value[1]];
      }

      if (isOpened) {
        fireEvent.click(
          screen.getAllByRole('gridcell', {
            name: adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
          })[0],
        );
      } else {
        selectSection('day');
        pressKey(undefined, 'ArrowUp');
      }

      return newValue;
    },
  }));
});
