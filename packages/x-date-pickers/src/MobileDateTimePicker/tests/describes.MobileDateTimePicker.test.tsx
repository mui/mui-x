import { screen, userEvent, fireTouchChangedEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  expectInputPlaceholder,
  openPicker,
  getClockTouchEvent,
  getTextbox,
} from 'test/utils/pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { describePicker } from '@mui/x-date-pickers/tests/describePicker';

describe('<MobileDateTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 2, 12, 8, 16, 0),
  });

  describePicker(MobileDateTimePicker, { render, fieldType: 'single-input', variant: 'mobile' });

  describeValidation(MobileDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'mobile',
  }));

  describeValue(MobileDateTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-time',
    variant: 'mobile',
    clock,
    values: [
      adapterToUse.date(new Date(2018, 0, 1, 11, 30)),
      adapterToUse.date(new Date(2018, 0, 2, 12, 35)),
    ],
    emptyValue: null,
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
    setNewValue: (value, { isOpened, applySameValue }) => {
      if (!isOpened) {
        openPicker({ type: 'date-time', variant: 'mobile' });
      }

      const newValue = applySameValue
        ? value
        : adapterToUse.addMinutes(adapterToUse.addHours(adapterToUse.addDays(value, 1), 1), 5);
      userEvent.mousePress(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      // change hours
      const hourClockEvent = getClockTouchEvent(
        adapterToUse.getHours(newValue),
        hasMeridiem ? '12hours' : '24hours',
      );
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);
      // change minutes
      const minutesClockEvent = getClockTouchEvent(adapterToUse.getMinutes(newValue), 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', minutesClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', minutesClockEvent);

      if (hasMeridiem) {
        const newHours = adapterToUse.getHours(newValue);
        // select appropriate meridiem
        userEvent.mousePress(screen.getByRole('button', { name: newHours >= 12 ? 'PM' : 'AM' }));
      }

      // Close the picker
      if (!isOpened) {
        userEvent.keyPress(document.activeElement!, { key: 'Escape' });
        clock.runToLast();
      } else {
        // return to the date view in case we'd like to repeat the selection process
        userEvent.mousePress(screen.getByRole('tab', { name: 'pick date' }));
      }

      return newValue;
    },
  }));
});
