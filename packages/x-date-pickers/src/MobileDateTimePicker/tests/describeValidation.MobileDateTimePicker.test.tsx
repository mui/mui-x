import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { describe } from 'vitest';

describe('<MobileDateTimePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(MobileDateTimePicker, () => ({
    render,
    views: ['year', 'day', 'hours', 'minutes'],
    componentFamily: 'picker',
  }));
});
