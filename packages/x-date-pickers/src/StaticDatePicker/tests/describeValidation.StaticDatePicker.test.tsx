import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

describe('<StaticDatePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(StaticDatePicker, () => ({
    render,
    views: ['year', 'month', 'day'],
    componentFamily: 'static-picker',
  }));
});
