import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';

describe('<DesktopDateRangePicker /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeRangeValidation(DesktopDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'picker',
    views: ['day'],
    variant: 'desktop',
    fieldType: 'single-input',
  }));
});
