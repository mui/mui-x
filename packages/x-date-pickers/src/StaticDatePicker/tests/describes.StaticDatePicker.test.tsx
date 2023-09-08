import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { createPickerRenderer } from 'test/utils/pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { describePicker } from '@mui/x-date-pickers/tests/describePicker';

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
