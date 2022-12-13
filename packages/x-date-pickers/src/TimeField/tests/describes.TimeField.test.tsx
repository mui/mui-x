import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { screen, userEvent } from '@mui/monorepo/test/utils';
import {
  adapterToUse,
  buildFieldInteractions,
  createPickerRenderer,
  expectInputValue,
} from 'test/utils/pickers-utils';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import { TimeField } from '@mui/x-date-pickers/TimeField';

describe('<TimeField /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({ clock });

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
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      let expectedValueStr: string;
      if (expectedValue == null) {
        expectedValueStr = hasMeridiem ? 'hh:mm aa' : 'hh:mm';
      } else {
        expectedValueStr = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'fullTime12h' : 'fullTime24h',
        );
      }
      expectInputValue(screen.getByRole('textbox'), expectedValueStr, true);
    },
    setNewValue: (value) => {
      const newValue = adapterToUse.addHours(value, 1);

      const input = screen.getByRole('textbox');
      clickOnInput(input, 1); // Update the hour
      userEvent.keyPress(input, { key: 'ArrowUp' });

      return newValue;
    },
  }));
});
