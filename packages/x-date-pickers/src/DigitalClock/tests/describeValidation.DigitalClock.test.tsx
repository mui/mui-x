import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';

describe('<DigitalClock /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(DigitalClock, () => ({
    render,
    views: ['hours'],
    componentFamily: 'digital-clock',
  }));
});
