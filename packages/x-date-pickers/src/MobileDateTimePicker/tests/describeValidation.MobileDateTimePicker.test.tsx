import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

describe('<MobileDateTimePicker /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MobileDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'day', 'hours', 'minutes'],
    componentFamily: 'picker',
  }));
});
