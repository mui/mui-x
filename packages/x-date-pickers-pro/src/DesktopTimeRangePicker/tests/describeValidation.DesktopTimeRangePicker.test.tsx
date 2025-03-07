import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { DesktopTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';

describe('<DesktopTimeRangePicker /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeRangeValidation(DesktopTimeRangePicker, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'desktop',
    fieldType: 'single-input',
  }));
});
