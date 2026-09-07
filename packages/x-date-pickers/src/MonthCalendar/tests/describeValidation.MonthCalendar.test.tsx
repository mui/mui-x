import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { describe } from 'vitest';

describe('<MonthCalendar /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(MonthCalendar, () => ({
    render,
    views: ['month'],
    componentFamily: 'calendar',
  }));
});
