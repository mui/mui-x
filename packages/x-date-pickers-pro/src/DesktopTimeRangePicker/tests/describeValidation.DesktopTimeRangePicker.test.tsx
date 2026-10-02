import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { DesktopTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';
import { describe } from 'vitest';

describe('<DesktopTimeRangePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(DesktopTimeRangePicker, () => ({
    render,
    views: ['hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'desktop',
    fieldType: 'single-input',
  }));
});
