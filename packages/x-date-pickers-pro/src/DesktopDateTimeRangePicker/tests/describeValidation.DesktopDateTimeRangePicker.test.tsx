import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { DesktopDateTimeRangePicker } from '../DesktopDateTimeRangePicker';

describe('<DesktopDateTimeRangePicker /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeRangeValidation(DesktopDateTimeRangePicker, () => ({
    render,
    clock,
    views: ['day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'desktop',
    fieldType: 'single-input',
  }));
});
