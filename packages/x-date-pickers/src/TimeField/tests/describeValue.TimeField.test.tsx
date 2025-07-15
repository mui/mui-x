import {
  adapterToUse,
  createPickerRenderer,
  expectFieldValueV7,
  describeValue,
  formatFullTimeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<TimeField /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'field'>(TimeField, () => ({
    render,
    componentFamily: 'field',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const fieldRoot = getFieldInputRoot();

      let expectedValueStr: string;
      if (expectedValue) {
        expectedValueStr = formatFullTimeValue(adapterToUse, expectedValue);
      } else {
        expectedValueStr = hasMeridiem ? 'hh:mm aa' : 'hh:mm';
      }

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (value, { selectSection, pressKey }) => {
      const newValue = adapterToUse.addHours(value!, 1);
      selectSection('hours');
      pressKey(undefined, 'ArrowUp');

      return newValue;
    },
  }));
});
