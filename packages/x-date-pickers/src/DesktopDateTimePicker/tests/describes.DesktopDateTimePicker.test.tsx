import { screen, userEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  expectInputPlaceholder,
  getTextbox,
} from 'test/utils/pickers';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { describePicker } from '@mui/x-date-pickers/tests/describePicker';

describe('<DesktopDateTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describePicker(DesktopDateTimePicker, { render, fieldType: 'single-input', variant: 'desktop' });

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
    values: [
      adapterToUse.date(new Date(2018, 0, 1, 11, 30)),
      adapterToUse.date(new Date(2018, 0, 2, 12, 35)),
    ],
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
    setNewValue: (value, { isOpened, applySameValue, selectSection }) => {
      const newValue = applySameValue
        ? value
        : adapterToUse.addMinutes(adapterToUse.addHours(adapterToUse.addDays(value, 1), 1), 5);

      if (isOpened) {
        userEvent.mousePress(
          screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
        );
        const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
        const hours = adapterToUse.format(newValue, hasMeridiem ? 'hours12h' : 'hours24h');
        const hoursNumber = adapterToUse.getHours(newValue);
        userEvent.mousePress(screen.getByRole('option', { name: `${parseInt(hours, 10)} hours` }));
        userEvent.mousePress(
          screen.getByRole('option', { name: `${adapterToUse.getMinutes(newValue)} minutes` }),
        );
        if (hasMeridiem) {
          // meridiem is an extra view on `DesktopDateTimePicker`
          // we need to click it to finish selection
          userEvent.mousePress(
            screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }),
          );
        }
      } else {
        selectSection('day');
        const input = getTextbox();
        userEvent.keyPress(input, { key: 'ArrowUp' });
        // move to the hours section
        userEvent.keyPress(input, { key: 'ArrowRight' });
        userEvent.keyPress(input, { key: 'ArrowRight' });
        userEvent.keyPress(input, { key: 'ArrowUp' });
        // move to the minutes section
        userEvent.keyPress(input, { key: 'ArrowRight' });
        // increment by 5 minutes
        userEvent.keyPress(input, { key: 'PageUp' });
        const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
        if (hasMeridiem) {
          // move to the meridiem section
          userEvent.keyPress(input, { key: 'ArrowRight' });
          const previousHours = adapterToUse.getHours(value);
          const newHours = adapterToUse.getHours(newValue);
          // update meridiem section if it changed
          if ((previousHours < 12 && newHours >= 12) || (previousHours >= 12 && newHours < 12)) {
            userEvent.keyPress(input, { key: 'ArrowUp' });
          }
        }
      }

      return newValue;
    },
  }));
});
