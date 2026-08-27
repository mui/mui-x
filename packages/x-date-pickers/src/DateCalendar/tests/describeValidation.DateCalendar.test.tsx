import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { describe } from 'vitest';

describe('<DateCalendar /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(DateCalendar, () => ({
    render,
    views: ['year', 'month', 'day'],
    componentFamily: 'calendar',
  }));
});
