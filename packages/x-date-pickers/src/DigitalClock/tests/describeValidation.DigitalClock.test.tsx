import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';

describe('<DigitalClock /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DigitalClock, () => ({
    render,
    clock,
    views: ['hours'],
    componentFamily: 'digital-clock',
  }));
});
