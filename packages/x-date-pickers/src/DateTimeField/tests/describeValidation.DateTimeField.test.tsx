import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { createPickerRenderer, describeValidation } from 'test/utils/pickers';

describe('<DateTimeField /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(DateTimeField, () => ({
    render,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'field',
  }));
});
