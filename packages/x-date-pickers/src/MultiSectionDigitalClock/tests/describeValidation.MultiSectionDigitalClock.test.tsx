import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

describe('<MultiSectionDigitalClock /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(MultiSectionDigitalClock, () => ({
    render,
    views: ['hours', 'minutes'],
    componentFamily: 'multi-section-digital-clock',
  }));
});
