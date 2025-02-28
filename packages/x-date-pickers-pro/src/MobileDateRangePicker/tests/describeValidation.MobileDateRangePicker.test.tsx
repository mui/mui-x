import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';

describe('<MobileDateRangePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer({
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeRangeValidation(MobileDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    views: ['day'],
    variant: 'mobile',
    fieldType: 'single-input',
  }));
});
