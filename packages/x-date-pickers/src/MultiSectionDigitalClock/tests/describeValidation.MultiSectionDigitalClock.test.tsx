import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { describe } from 'vitest';

describe('<MultiSectionDigitalClock /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(MultiSectionDigitalClock, () => ({
    render,
    views: ['hours', 'minutes'],
    componentFamily: 'multi-section-digital-clock',
  }));
});
