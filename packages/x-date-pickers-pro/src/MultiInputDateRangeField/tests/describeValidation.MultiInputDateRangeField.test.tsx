import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import {
  adapterToUse,
  createPickerRenderer,
  describeRangeValidation,
  setValueOnFieldInput,
} from 'test/utils/pickers';

describe('<MultiInputDateRangeField /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(MultiInputDateRangeField, () => ({
    render,
    componentFamily: 'field',
    fieldType: 'multi-input',
    views: ['year', 'month', 'day'],
    setValue: (value, { setEndDate } = {}) => {
      setValueOnFieldInput(adapterToUse.format(value, 'keyboardDate'), setEndDate ? 1 : 0);
    },
  }));
});
