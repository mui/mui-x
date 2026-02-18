import { screen, fireEvent } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  openPickerAsync,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<MobileDatePicker /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'picker'>(MobileDatePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date',
    variant: 'mobile',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const fieldRoot = getFieldInputRoot();

      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, 'keyboardDate')
        : 'MM/DD/YYYY';

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: async (value, { isOpened, applySameValue, user }) => {
      if (!isOpened) {
        await openPickerAsync(user, { type: 'date' });
      }

      const newValue = applySameValue ? value! : adapterToUse.addDays(value!, 1);
      fireEvent.click(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );

      // Close the Picker to return to the initial state
      if (!isOpened) {
        await user.keyboard('[Escape]');
      }

      return newValue;
    },
  }));
});
