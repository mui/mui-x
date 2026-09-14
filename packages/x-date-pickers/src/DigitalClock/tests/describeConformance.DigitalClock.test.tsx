import { createPickerRenderer } from 'test/utils/pickers';
import { DigitalClock, digitalClockClasses as classes } from '@mui/x-date-pickers/DigitalClock';
import { describeConformance } from 'test/utils/describeConformance';
import { describe } from 'vitest';

describe('<DigitalClock /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(<DigitalClock />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiDigitalClock',
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp', 'themeVariants'],
  }));
});
