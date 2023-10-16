import { userEvent } from '@mui-internal/test-utils';
import {
  adapterToUse,
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
  getTextbox,
  describeValidation,
  describeValue,
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
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const input = getTextbox();
      if (!expectedValue) {
        expectInputPlaceholder(input, hasMeridiem ? 'hh:mm aa' : 'hh:mm');
      }
      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, hasMeridiem ? 'fullTime12h' : 'fullTime24h')
        : '';
      expectInputValue(input, expectedValueStr);
    },
    setNewValue: (value, { selectSection }) => {
      const newValue = adapterToUse.addHours(value, 1);
      selectSection('hours');
      const input = getTextbox();
      userEvent.keyPress(input, { key: 'ArrowUp' });

      return newValue;
    },
  }));
});
