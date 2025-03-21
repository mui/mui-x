import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createPickerRenderer, describeValidation } from 'test/utils/pickers';

describe('<DateCalendar /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateCalendar, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'calendar',
  }));
});
