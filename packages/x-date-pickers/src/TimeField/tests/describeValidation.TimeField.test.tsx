import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { TimeField } from '@mui/x-date-pickers/TimeField';

describe('<TimeField /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(TimeField, () => ({
    render,
    views: ['hours', 'minutes'],
    componentFamily: 'field',
  }));
});
