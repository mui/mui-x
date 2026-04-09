import { screen, fireTouchChangedEvent } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValue,
  openPicker,
  getClockTouchEvent,
  describeValue,
  formatFullTimeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<MobileTimePicker /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'picker'>(MobileTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'time',
    variant: 'mobile',
    values: [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-01T12:35:00')],
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

      expectFieldValue(fieldRoot, expectedValueStr);
    },
    setNewValue: async (value, { isOpened, applySameValue, user }) => {
      if (!isOpened) {
        await openPicker(user, { type: 'time' });
      }

      const newValue = applySameValue
        ? value!
        : adapterToUse.addMinutes(adapterToUse.addHours(value!, 1), 5);
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      // change hours
      const hourClockEvent = getClockTouchEvent(
        adapterToUse.getHours(newValue),
        hasMeridiem ? '12hours' : '24hours',
      );
      fireTouchChangedEvent(screen.getByTestId('clock'), 'touchmove', hourClockEvent);
      fireTouchChangedEvent(screen.getByTestId('clock'), 'touchend', hourClockEvent);
      // change minutes
      const minutesClockEvent = getClockTouchEvent(adapterToUse.getMinutes(newValue), 'minutes');
      fireTouchChangedEvent(screen.getByTestId('clock'), 'touchmove', minutesClockEvent);
      fireTouchChangedEvent(screen.getByTestId('clock'), 'touchend', minutesClockEvent);

      if (hasMeridiem) {
        const newHours = adapterToUse.getHours(newValue);
        // select appropriate meridiem
        await user.click(screen.getByRole('button', { name: newHours >= 12 ? 'PM' : 'AM' }));
      }

      // Close the picker
      if (!isOpened) {
        await user.keyboard('{Escape}');
      } else {
        // Return to the hours view in case we'd like to repeat the selection
        // process. The "Open previous view" button becomes disabled after we
        // land back on the first view, which traps focus on a disabled
        // element and swallows follow-up keyboard events. Click the dialog
        // body to move focus to a live element so callers can press Escape
        // to dismiss the picker.
        await user.click(screen.getByRole('button', { name: 'Open previous view' }));
        await user.click(screen.getByRole('dialog'));
      }

      return newValue;
    },
  }));
});
