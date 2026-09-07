import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { describe } from 'vitest';

describe('<MobileTimePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(MobileTimePicker, () => ({
    render,
    views: ['hours', 'minutes'],
    componentFamily: 'picker',
  }));
});
