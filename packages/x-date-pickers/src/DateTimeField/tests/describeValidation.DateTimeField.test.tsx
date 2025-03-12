import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { createPickerRenderer, describeValidation } from 'test/utils/pickers';

describe('<DateTimeField /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateTimeField, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'field',
  }));
});
