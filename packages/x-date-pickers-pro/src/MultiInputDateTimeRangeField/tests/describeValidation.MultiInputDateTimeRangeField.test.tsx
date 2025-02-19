import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import {
  adapterToUse,
  createPickerRenderer,
  describeRangeValidation,
  setValueOnFieldInput,
} from 'test/utils/pickers';

describe('<MultiInputDateTimeRangeField /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(MultiInputDateTimeRangeField, () => ({
    render,
    componentFamily: 'field',
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    setValue: (value, { setEndDate } = {}) => {
      setValueOnFieldInput(adapterToUse.format(value, 'keyboardDateTime12h'), setEndDate ? 1 : 0);
    },
  }));
});
