import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, describeValidation } from 'test/utils/pickers';

describe('<YearCalendar /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(YearCalendar, () => ({
    render,
    clock,
    views: ['year'],
    componentFamily: 'calendar',
  }));
});
