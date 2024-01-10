import { userEvent } from '@mui-internal/test-utils';
import {
  adapterToUse,
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
  getTextbox,
  describeValidation,
  describeValue,
  formatFullTimeValue,
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
      const input = getTextbox();
      if (!expectedValue) {
        expectInputPlaceholder(input, hasMeridiem ? 'hh:mm aa' : 'hh:mm');
      }
      const expectedValueStr = expectedValue
        ? formatFullTimeValue(adapterToUse, expectedValue)
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
