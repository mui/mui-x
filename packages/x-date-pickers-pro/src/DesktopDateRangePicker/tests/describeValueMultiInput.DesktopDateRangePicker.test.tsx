import { fireEvent, screen } from '@mui/internal-test-utils';
import {
  adapterToUse,
  createPickerRenderer,
  expectFieldValueV7,
  describeValue,
  getFieldSectionsContainer,
} from 'test/utils/pickers';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { PickerNonNullableRangeValue, PickerRangeValue } from '@mui/x-date-pickers/internals';

describe('<DesktopDateRangePicker /> - Describe Value', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeValue<PickerRangeValue, 'picker'>(DesktopDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'picker',
    type: 'date-range',
    variant: 'desktop',
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

      const endSectionsContainer = getFieldSectionsContainer(1);
      const expectedEndValueStr = expectedValues[1]
        ? adapterToUse.format(expectedValues[1], 'keyboardDate')
        : 'MM/DD/YYYY';
      expectFieldValueV7(endSectionsContainer, expectedEndValueStr);
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
