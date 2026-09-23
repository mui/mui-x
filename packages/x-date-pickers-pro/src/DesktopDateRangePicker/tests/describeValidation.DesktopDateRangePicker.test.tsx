import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { describe } from 'vitest';

describe('<DesktopDateRangePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(DesktopDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    views: ['day'],
    variant: 'desktop',
    fieldType: 'single-input',
  }));
});
