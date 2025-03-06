import { DateField } from '@mui/x-date-pickers/DateField';
import { createPickerRenderer, describeValidation } from 'test/utils/pickers';

describe('<DateField /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(DateField, () => ({
    render,
    views: ['year', 'month', 'day'],
    componentFamily: 'field',
  }));
});
