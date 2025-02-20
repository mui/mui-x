import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';

describe('<SingleInputTimeRangeField /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(SingleInputTimeRangeField, () => ({
    render,
    componentFamily: 'field',
    views: ['hours', 'minutes', 'seconds'],
    fieldType: 'single-input',
  }));
});
