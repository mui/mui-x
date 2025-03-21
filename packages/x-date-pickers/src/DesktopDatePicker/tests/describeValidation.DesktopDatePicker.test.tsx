import { createPickerRenderer, describeValidation, describePicker } from 'test/utils/pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

describe('<DesktopDatePicker /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describePicker(DesktopDatePicker, { render, fieldType: 'single-input', variant: 'desktop' });

  describeValidation(DesktopDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'picker',
  }));
});
