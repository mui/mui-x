import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';

describe('<SingleInputTimeRangeField /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(SingleInputTimeRangeField, () => ({
    render,
    clock,
    componentFamily: 'field',
    views: ['hours', 'minutes', 'seconds'],
    fieldType: 'single-input',
  }));
});
