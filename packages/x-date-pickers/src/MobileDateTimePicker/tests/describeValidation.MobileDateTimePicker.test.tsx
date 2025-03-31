import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

describe('<MobileDateTimePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(MobileDateTimePicker, () => ({
    render,
    views: ['year', 'day', 'hours', 'minutes'],
    componentFamily: 'picker',
  }));
});
