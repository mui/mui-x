import { DateField } from '@mui/x-date-pickers/DateField';
import { createPickerRenderer, describeValidation } from 'test/utils/pickers';

describe('<DateField /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateField, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'field',
  }));
});
