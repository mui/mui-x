import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';

describe('<SingleInputDateRangeField /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(SingleInputDateRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['year', 'month', 'day'],
    fieldType: 'single-input',
  }));
});
