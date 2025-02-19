import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';

describe('<DesktopDateRangePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(DesktopDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    views: ['day'],
    variant: 'desktop',
  }));
});
