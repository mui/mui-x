import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

describe('<MobileDatePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(MobileDatePicker, () => ({
    render,
    views: ['year', 'month', 'day'],
    componentFamily: 'picker',
  }));
});
