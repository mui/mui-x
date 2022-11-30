import { screen, userEvent, fireTouchChangedEvent } from '@mui/monorepo/test/utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { describeValue } from '@mui/x-date-pickers/tests/describeValue';
import {
  createPickerRenderer,
  adapterToUse,
  expectInputValue,
  openPicker,
  getClockTouchEvent,
} from 'test/utils/pickers-utils';
import { Unstable_MobileNextDateTimePicker as MobileNextDateTimePicker } from '@mui/x-date-pickers/MobileNextDateTimePicker';

describe('<MobileNextDateTimePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MobileNextDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'new-picker',
  }));

  describeValue(MobileNextDateTimePicker, () => ({
    render,
    componentFamily: 'new-picker',
    type: 'date-time',
    variant: 'mobile',
    defaultProps: {
      openTo: 'minutes',
    },
    values: [adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 2))],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      let expectedValueStr: string;
      if (expectedValue == null) {
        expectedValueStr = hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm';
      } else {
        expectedValueStr = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h',
        );
      }

      expectInputValue(screen.getByRole('textbox'), expectedValueStr, true);
    },
    setNewValue: (value, { isOpened, applySameValue } = {}) => {
      if (!isOpened) {
        openPicker({ type: 'time', variant: 'mobile' });
      }

      const newValue = applySameValue ? value : adapterToUse.addMinutes(value, 1);
      const hourClockEvent = getClockTouchEvent(adapterToUse.getMinutes(newValue), 'minutes');
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchend', hourClockEvent);

      // Close the picker to return to the initial state
      if (!isOpened) {
        userEvent.keyPress(document.activeElement!, { key: 'Escape' });
        clock.runToLast();
      }

      return newValue;
    },
  }));
});
