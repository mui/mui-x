import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { MobileDateTimeRangePicker } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';

describe('<MobileDateTimeRangePicker /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeRangeValidation(MobileDateTimeRangePicker, () => ({
    render,
    clock,
    views: ['day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'mobile',
    fieldType: 'single-input',
  }));
});
