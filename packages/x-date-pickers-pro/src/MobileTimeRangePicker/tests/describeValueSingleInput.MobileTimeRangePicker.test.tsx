import { fireEvent, screen } from '@mui/internal-test-utils';
import { PickerNonNullableRangeValue, PickerRangeValue } from '@mui/x-date-pickers/internals';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  describeValue,
  openPicker,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';

describe('<MobileTimeRangePicker /> - Describe Value Single Input', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerRangeValue, 'picker'>(MobileTimeRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'time-range',
    variant: 'mobile',
    initialFocus: 'start',
    fieldType: 'single-input',
    values: [
      // initial start and end dates
      [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-04T11:45:00')],
      // start and end dates after `setNewValue`
      [adapterToUse.date('2018-01-02T12:35:00'), adapterToUse.date('2018-01-05T12:50:00')],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const expectedPlaceholder = hasMeridiem ? 'hh:mm aa' : 'hh:mm';
      const fieldRoot = getFieldInputRoot(0);

      const expectedStartValueStr = expectedValues[0]
        ? adapterToUse.format(expectedValues[0], hasMeridiem ? 'fullTime12h' : 'fullTime24h')
        : expectedPlaceholder;

      const expectedEndValueStr = expectedValues[1]
        ? adapterToUse.format(expectedValues[1], hasMeridiem ? 'fullTime12h' : 'fullTime24h')
        : expectedPlaceholder;

      const expectedValueStr = `${expectedStartValueStr} – ${expectedEndValueStr}`;

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue, setEndDate = false, closeMobilePicker }) => {
      if (!isOpened) {
        openPicker({
          type: 'time-range',
          initialFocus: setEndDate ? 'end' : 'start',
          fieldType: 'single-input',
        });
      }

      let newValue: PickerNonNullableRangeValue;
      if (applySameValue) {
        newValue = value;
      } else if (setEndDate) {
        newValue = [value[0], adapterToUse.addMinutes(adapterToUse.addHours(value[1], 1), 5)];
      } else {
        newValue = [adapterToUse.addMinutes(adapterToUse.addHours(value[0], 1), 5), value[1]];
      }

      // Go to the start date or the end date
      fireEvent.click(screen.getByRole('tab', { name: setEndDate ? 'End' : 'Start' }));

      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const hours = adapterToUse.format(
        newValue[setEndDate ? 1 : 0],
        hasMeridiem ? 'hours12h' : 'hours24h',
      );
      const hoursNumber = adapterToUse.getHours(newValue[setEndDate ? 1 : 0]);
      fireEvent.click(screen.getByRole('option', { name: `${parseInt(hours, 10)} hours` }));
      fireEvent.click(
        screen.getByRole('option', {
          name: `${adapterToUse.getMinutes(newValue[setEndDate ? 1 : 0])} minutes`,
        }),
      );
      if (hasMeridiem) {
        fireEvent.click(screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }));
      }

      if (closeMobilePicker) {
        if (setEndDate) {
          fireEvent.click(screen.getByRole('button', { name: /ok/i }));
        } else {
          // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
          fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
        }
      }

      return newValue;
    },
  }));
});
