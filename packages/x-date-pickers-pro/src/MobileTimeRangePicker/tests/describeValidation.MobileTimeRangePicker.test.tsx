import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';

describe('<MobileTimeRangePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(MobileTimeRangePicker, () => ({
    render,
    views: ['hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'mobile',
    fieldType: 'single-input',
  }));
});
