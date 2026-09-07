import { createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { describe } from 'vitest';

describe('<DigitalClock /> - Describe Validation', () => {
  const { render } = createPickerRenderer();

  describeValidation(DigitalClock, () => ({
    render,
    views: ['hours'],
    componentFamily: 'digital-clock',
  }));
});
