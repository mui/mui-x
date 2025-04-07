import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createPickerRenderer, describeValidation } from 'test/utils/pickers';

describe('<DateCalendar /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(DateCalendar, () => ({
    render,
    views: ['year', 'month', 'day'],
    componentFamily: 'calendar',
  }));
});
