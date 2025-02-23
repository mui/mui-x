import { DateField } from '@mui/x-date-pickers/DateField';
import { PickerValue } from '@mui/x-date-pickers/internals';
import {
  createPickerRenderer,
  expectFieldValueV7,
  adapterToUse,
  describeValue,
  getFieldInputRoot,
} from 'test/utils/pickers';

describe('<DateField /> - Describe Value', () => {
  const { render } = createPickerRenderer();

  describeValue<PickerValue, 'field'>(DateField, () => ({
    render,
    componentFamily: 'field',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const fieldRoot = getFieldInputRoot();

      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, 'keyboardDate')
        : 'MM/DD/YYYY';

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: async (value, _, { selectSection, pressKey }) => {
      const newValue = adapterToUse.addDays(value!, 1);
      selectSection('day');
      pressKey(undefined, 'ArrowUp');

      return newValue;
    },
  }));
});
