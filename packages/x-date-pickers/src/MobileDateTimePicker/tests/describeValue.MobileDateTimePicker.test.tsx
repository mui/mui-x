import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValue,
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

      expectFieldValue(fieldRoot, expectedValueStr);
    },
    setNewValue: async (value, { isOpened, applySameValue, user }) => {
      if (!isOpened) {
        await openPicker(user, { type: 'date-time' });
      }

      const newValue = applySameValue
        ? value!
        : adapterToUse.addMinutes(adapterToUse.addHours(adapterToUse.addDays(value!, 1), 1), 5);
      await user.click(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );
      await user.click(screen.getByRole('button', { name: 'Next' }));
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const hours = adapterToUse.format(newValue, hasMeridiem ? 'hours12h' : 'hours24h');
      const hoursNumber = adapterToUse.getHours(newValue);
      await user.click(screen.getByRole('option', { name: `${parseInt(hours, 10)} hours` }));
      await user.click(
        screen.getByRole('option', { name: `${adapterToUse.getMinutes(newValue)} minutes` }),
      );
      if (hasMeridiem) {
        await user.click(screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }));
      }

      // Close the picker
      if (!isOpened) {
        await user.keyboard('{Escape}');
      } else {
        // return to the date view in case we'd like to repeat the selection process
        await user.click(screen.getByRole('tab', { name: 'pick date' }));
      }

      return newValue;
    },
  }));
});
