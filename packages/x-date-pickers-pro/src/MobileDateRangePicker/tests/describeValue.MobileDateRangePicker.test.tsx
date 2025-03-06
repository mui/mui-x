import { screen, fireEvent } from '@mui/internal-test-utils';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { PickerNonNullableRangeValue, PickerRangeValue } from '@mui/x-date-pickers/internals';
import {
  adapterToUse,
  createPickerRenderer,
  openPicker,
  expectFieldValueV7,
  describeValue,
  getFieldSectionsContainer,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

describe('<MobileDateRangePicker /> - Describes', () => {
  const { render } = createPickerRenderer({
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeValue<PickerRangeValue, 'picker'>(MobileDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-range',
    variant: 'mobile',
    initialFocus: 'start',
    fieldType: 'multi-input',
    defaultProps: {
      slots: { field: MultiInputDateRangeField },
    },
    values: [
      // initial start and end dates
      [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-04')],
      // start and end dates after `setNewValue`
      [adapterToUse.date('2018-01-02'), adapterToUse.date('2018-01-05')],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      const startSectionsContainer = getFieldSectionsContainer(0);
      const expectedStartValueStr = expectedValues[0]
        ? adapterToUse.format(expectedValues[0], 'keyboardDate')
        : 'MM/DD/YYYY';
      expectFieldValueV7(startSectionsContainer, expectedStartValueStr);

      const endFieldRoot = getFieldSectionsContainer(1);
      const expectedEndValueStr = expectedValues[1]
        ? adapterToUse.format(expectedValues[1], 'keyboardDate')
        : 'MM/DD/YYYY';
      expectFieldValueV7(endFieldRoot, expectedEndValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue, setEndDate = false }) => {
      let newValue: PickerNonNullableRangeValue;
      if (applySameValue) {
        newValue = value;
      } else if (setEndDate) {
        newValue = [value[0], adapterToUse.addDays(value[1], 1)];
      } else {
        newValue = [adapterToUse.addDays(value[0], 1), value[1]];
      }

      if (!isOpened) {
        openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'multi-input' });
      }

      fireEvent.click(
        screen.getByRole('gridcell', {
          name: adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
        }),
      );

      // Close the picker
      if (!isOpened) {
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      }

      return newValue;
    },
  }));

  // With single input field
  describeValue<PickerRangeValue, 'picker'>(MobileDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-range',
    variant: 'mobile',
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
