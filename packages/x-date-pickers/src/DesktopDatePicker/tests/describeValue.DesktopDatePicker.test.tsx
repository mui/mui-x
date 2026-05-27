import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValue,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('<DesktopDatePicker /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'picker'>(DesktopDatePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date',
    variant: 'desktop',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const fieldRoot = getFieldInputRoot();

      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, 'keyboardDate')
        : 'MM/DD/YYYY';

      expectFieldValue(fieldRoot, expectedValueStr);
    },
    setNewValue: async (value, { isOpened, applySameValue, selectSection, pressKey, user }) => {
      const newValue = applySameValue ? value! : adapterToUse.addDays(value!, 1);

      if (isOpened) {
        await user.click(
          screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
        );
      } else {
        await selectSection('day');
        await pressKey('ArrowUp');
      }

      return newValue;
    },
  }));
});
