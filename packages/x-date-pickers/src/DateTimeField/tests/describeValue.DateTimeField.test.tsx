import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { PickerValue } from '@mui/x-date-pickers/internals';
import {
  adapterToUse,
  createPickerRenderer,
  expectFieldValueV7,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';

describe('<DateTimeField /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'field'>(DateTimeField, () => ({
    render,
    componentFamily: 'field',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const fieldRoot = getFieldInputRoot();

      let expectedValueStr: string;
      if (expectedValue) {
        expectedValueStr = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h',
        );
      } else {
        expectedValueStr = hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm';
      }

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (value, { selectSection, pressKey }) => {
      const newValue = adapterToUse.addDays(value!, 1);
      selectSection('day');
      pressKey(undefined, 'ArrowUp');

      return newValue;
    },
  }));
});
