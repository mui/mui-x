import { createPickerRenderer, describeValidation, describePicker } from 'test/utils/pickers';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

describe('<StaticDateTime /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describePicker(StaticDateTimePicker, { render, fieldType: 'single-input', variant: 'static' });

  describeValidation(StaticDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'static-picker',
  }));
});
