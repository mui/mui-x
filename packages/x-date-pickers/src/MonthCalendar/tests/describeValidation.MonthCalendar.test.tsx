import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';

describe('<MonthCalendar /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MonthCalendar, () => ({
    render,
    clock,
    views: ['month'],
    componentFamily: 'calendar',
  }));
});
