import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

describe('<DesktopDateTimePicker /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(DesktopDateTimePicker, () => ({
    render,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'picker',
  }));
});
