import { screen, userEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  buildFieldInteractions,
  getTextbox,
  expectInputPlaceholder,
} from 'test/utils/pickers-utils';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

describe('<DesktopDateTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  const { clickOnInput } = buildFieldInteractions({
    clock,
    render,
    Component: DesktopDateTimePicker,
  });

  describeValidation(DesktopDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'desktop',
  }));

  describeValue(DesktopDateTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-time',
    variant: 'desktop',
    defaultProps: {
      views: ['day'],
      openTo: 'day',
    },
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
    setNewValue: (value, { isOpened, applySameValue } = {}) => {
      const newValue = applySameValue ? value : adapterToUse.addDays(value, 1);

      if (isOpened) {
        userEvent.mousePress(
          screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
        );
      } else {
        const input = getTextbox();
        clickOnInput(input, 5); // Update the day
        userEvent.keyPress(input, { key: 'ArrowUp' });
      }

      return newValue;
    },
  }));
});
