import { createPickerRenderer, describeRangeValidation } from 'test/utils/pickers';
import { describe } from 'vitest';
import { DesktopDateTimeRangePicker } from '../DesktopDateTimeRangePicker';

describe('<DesktopDateTimeRangePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeRangeValidation(DesktopDateTimeRangePicker, () => ({
    render,
    views: ['day', 'hours', 'minutes'],
    componentFamily: 'picker',
    variant: 'desktop',
    fieldType: 'single-input',
  }));
});
