import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, describeValidation } from 'test/utils/pickers';

describe('<YearCalendar /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(YearCalendar, () => ({
    render,
    views: ['year'],
    componentFamily: 'calendar',
  }));
});
