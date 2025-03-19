import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

describe('<MultiSectionDigitalClock /> - Describe Validation', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(MultiSectionDigitalClock, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'multi-section-digital-clock',
  }));
});
