import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { MobileDateTimeRangePicker } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';

describe('<MobileDateTimeRangePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(MobileDateTimeRangePicker, () => ({
    render,
    views: ['day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'mobile',
    fieldType: 'single-input',
  }));
});
