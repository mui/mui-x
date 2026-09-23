import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { describe } from 'vitest';

describe('<MobileDateRangePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(MobileDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    views: ['day'],
    variant: 'mobile',
    fieldType: 'single-input',
  }));
});
