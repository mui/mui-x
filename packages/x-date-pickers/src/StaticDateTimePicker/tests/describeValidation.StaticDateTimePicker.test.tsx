import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

describe('<StaticDateTimePicker /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(StaticDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'static-picker',
  }));
});
