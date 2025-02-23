import { screen, fireEvent, fireTouchChangedEvent } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
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

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: async (value, user, { isOpened, applySameValue }) => {
      if (!isOpened) {
        openPicker({ type: 'time' });
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
        fireEvent.click(screen.getByRole('button', { name: newHours >= 12 ? 'PM' : 'AM' }));
      }

      // Close the picker
      if (!isOpened) {
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      } else {
        // return to the hours view in case we'd like to repeat the selection process
        fireEvent.click(screen.getByRole('button', { name: 'Open previous view' }));
      }

      return newValue;
    },
  }));
});
