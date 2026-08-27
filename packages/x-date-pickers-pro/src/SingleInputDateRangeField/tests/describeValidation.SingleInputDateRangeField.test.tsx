import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { describe } from 'vitest';

describe('<SingleInputDateRangeField /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(SingleInputDateRangeField, () => ({
    render,
    componentFamily: 'field',
    views: ['year', 'month', 'day'],
    fieldType: 'single-input',
  }));
});
