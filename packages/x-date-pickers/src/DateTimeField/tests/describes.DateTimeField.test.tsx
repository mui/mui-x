import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { userEvent } from '@mui/monorepo/test/utils';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import {
  adapterToUse,
  buildFieldInteractions,
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
  getTextbox,
} from 'test/utils/pickers-utils';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';

describe('<DateTimeField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({ clock, render, Component: DateTimeField });

  describeValidation(DateTimeField, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'field',
  }));

  describeValue(DateTimeField, () => ({
    render,
    componentFamily: 'field',
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const input = getTextbox();
      if (!expectedValue) {
        expectInputPlaceholder(input, hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm');
      }
      const expectedValueStr = expectedValue
        ? adapterToUse.format(
            expectedValue,
            hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h',
          )
        : '';

      expectInputValue(input, expectedValueStr);
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addDays(value, 1);
      const input = getTextbox();
      clickOnInput(input, 5); // Update the day
      userEvent.keyPress(input, { key: 'ArrowUp' });
      return newValue;
    },
  }));
});
