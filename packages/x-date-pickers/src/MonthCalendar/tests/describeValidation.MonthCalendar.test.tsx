import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';

describe('<MonthCalendar /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(MonthCalendar, () => ({
    render,
    views: ['month'],
    componentFamily: 'calendar',
  }));
});
