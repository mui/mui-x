import { screen, fireEvent } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  openPicker,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<MobileDateTimePicker /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'picker'>(MobileDateTimePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-time',
    variant: 'mobile',
    values: [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-02T12:35:00')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const fieldRoot = getFieldInputRoot();

      let expectedValueStr: string;
      if (expectedValue) {
        expectedValueStr = adapterToUse.format(
          expectedValue,
          hasMeridiem ? 'keyboardDateTime12h' : 'keyboardDateTime24h',
        );
      } else {
        expectedValueStr = hasMeridiem ? 'MM/DD/YYYY hh:mm aa' : 'MM/DD/YYYY hh:mm';
      }

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue }) => {
      if (!isOpened) {
        openPicker({ type: 'date-time' });
      }

      const newValue = applySameValue
        ? value!
        : adapterToUse.addMinutes(adapterToUse.addHours(adapterToUse.addDays(value!, 1), 1), 5);
      fireEvent.click(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const hours = adapterToUse.format(newValue, hasMeridiem ? 'hours12h' : 'hours24h');
      const hoursNumber = adapterToUse.getHours(newValue);
      fireEvent.click(screen.getByRole('option', { name: `${parseInt(hours, 10)} hours` }));
      fireEvent.click(
        screen.getByRole('option', { name: `${adapterToUse.getMinutes(newValue)} minutes` }),
      );
      if (hasMeridiem) {
        fireEvent.click(screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }));
      }

      // Close the picker
      if (!isOpened) {
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      } else {
        // return to the date view in case we'd like to repeat the selection process
        fireEvent.click(screen.getByRole('tab', { name: 'pick date' }));
      }

      return newValue;
    },
  }));
});
