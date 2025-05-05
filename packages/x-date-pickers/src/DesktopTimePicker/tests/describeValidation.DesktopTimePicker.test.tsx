import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

describe('<DesktopTimePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(DesktopTimePicker, () => ({
    render,
    views: ['hours', 'minutes'],
    componentFamily: 'picker',
  }));
});
