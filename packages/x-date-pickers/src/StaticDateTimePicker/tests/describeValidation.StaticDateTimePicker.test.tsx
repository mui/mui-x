import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

describe('<StaticDateTimePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(StaticDateTimePicker, () => ({
    render,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'static-picker',
  }));
});
