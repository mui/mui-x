import { createPickerRenderer, describeValidation, describePicker } from 'test/utils/pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

describe('<StaticDatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describePicker(StaticDatePicker, { render, fieldType: 'single-input', variant: 'static' });

  describeValidation(StaticDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'static-picker',
  }));
});
