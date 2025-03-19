import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

describe('<StaticDatePicker /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(StaticDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'static-picker',
  }));
});
