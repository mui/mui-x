import {
  adapterToUse,
  createPickerRenderer,
  expectFieldValueV7,
  describeValidation,
  describeValue,
  formatFullTimeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { TimeField } from '@mui/x-date-pickers/TimeField';

describe('<TimeField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(TimeField, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'field',
  }));

  describeValue(TimeField, () => ({
    render,
    componentFamily: 'field',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    clock,
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
      const newValue = adapterToUse.addHours(value, 1);
      selectSection('hours');
      pressKey(undefined, 'ArrowUp');

      return newValue;
    },
  }));
});
